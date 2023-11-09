import express from 'express';
import cors from 'cors'
const server = express();
const port = 4000;
import bcrypt from 'bcrypt';
import knex from 'knex';
import multer from 'multer'
import path from 'path';
import { fileURLToPath } from 'url';
import { Dropbox } from 'dropbox'
import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config({ path: './.env'});

const client = new pg.Client({
  connectionString: process.env.ELEPHANTSQL_URL,
  ssl: false // CHANGE THIS WHEN DEPLOYING!!!
});

client.connect()
  .then(() => console.log('Connected to ElephantSQL', client.database))
  .catch((err) => {
    console.error('Error connecting to ElephantSQL:', err)});

const dropboxApiKey = process.env.DROPBOX_API_KEY;
const dropbox = new Dropbox({ accessToken: dropboxApiKey });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// multer profile pic storage - Might be replaced by dropbox api...
const profilePicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/photos'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});
const profilePicUpload = multer({ storage: profilePicStorage });
 //multer songStorage - See above...
const songStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/songs');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  }
});
const songUpload = multer({ storage: songStorage });

const db = knex({
  client: 'pg', 
  connection: process.env.ELEPHANTSQL_URL
});

server.use(express.json());
server.use(cors({ origin: 'http://localhost:3000' }));
server.use('/uploads', express.static('uploads'));


server.get('/', (req, res) => { // home feed should display a variety of things: newest song submissions, collabs, and status updates
    db.select('*').from('users')
    .then(data => {
      console.log(data)
        res.json(data)
    })
})

server.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.select('*')
    .from('users')
    .where('user_email', '=', email.lower())
    .then(userData => {
      if (userData.length === 0) {
        return res.status(400).json('no email Creds Bro');
      }
      const userId = userData[0].id;
      return db.select('hash')
        .from('login')
        .where('user_id', '=', userId)
        .then(loginData => {
          if (loginData.length === 0) {
            return res.status(400).json('Insufficient Creds Bro, database err');
          }
          bcrypt.compare(password, loginData[0].hash, (err, result) => {
            if (result) {
              return db.select('*')
                .from('users')
                .where('user_id', '=', userId)
                .then(user => {
                  res.json(user[0]);
                })
                .catch(err => {
                  res.status(400).json('Unable to get user');
                });
            } else {
              res.status(400).json('Very Much Wrong Creds Bro');
            }
          });
        });
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({ error: 'Wrong Creds Bro', details: err });
    });
});


  server.post('/register', (req, res) => {
    const { email, username, password } = req.body;
if (!email || !username || !password) {
  return res.status(400).json('Missing email, username, or password...')
}
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.log('Error hashing password', err);
      }
      db.transaction((trx) => {
        trx('users')
          .returning('*')
          .insert({
            user_email: email,
            username: username,
            date_user_joined: new Date(),
            score: 0,
            user_status: 'New in town...',
            user_profile_pic: 'https://www.dropbox.com/scl/fi/p2wxffl51e50wybb5nrz1/logo.png?rlkey=hkgaocdy6duq4ze2w9b3tvhkq&dl=0'
          })
          .then((user) => {
            const userId = user[0].id;
            return trx('login')
              .returning('*')
              .insert({
                hash: hash,
                user_id: userId, 
              })
          .then((user) => {
            trx.commit();
            res.json(user[0]);
          });
        })
              .catch((err) => {
                trx.rollback();
                res.status(400).json('Unable to register1' + err.message);
              });
          })
          
      });
    });

    
server.put('/upload-profile-pic', profilePicUpload.single('photo'), (req, res) => {
  const user  = req.body.user.id;
  const uploadedPhoto = req.file;
   if (!uploadedPhoto) {
    return res.status(400).json({ error: 'No profile photo provided' });
  }
  const filepath = path.join(__dirname, 'uploads', 'photos', uploadedPhoto.filename);

  db('users')
  .where('id', user)
  .update({profilephoto: uploadedPhoto.filename})
  .then(() => {
    res.status(200).json({newPhoto: uploadedPhoto.filename})
  }).catch((error) => {
    console.error('Error updating Database: ', error);
    res.status(500).json({error: 'Server XXXX Error'})
  })
});

server.put('/update-status', (req, res) => {
  const { id, newStatus } = req.body
  db('users')
  .where('id', id)
  .update({status: newStatus})
  .then(() => {
    res.status(200).json({status: newStatus})
  }).catch((error) => {
    console.error('Error setting new status in Database', error);
    res.status(500).json({error: 'Server Status Error'})
  })
});

server.post('/submit', (req, res) => {
  const uploadedSong = req.song_file;
  if (!uploadedSong) {
    return res.status(400).json({ error: 'No song provided' });
  }
  const songFilePath = path.join(__dirname, 'uploads', 'songs', uploadedSong.filename);
  const songFileStream = fs.createReadStream(songFilePath);
  dbx.filesUpload({
    path: '/songs/' + uploadedSong.filename,
    contents: songFileStream,
  }).then(() => {
    return db('songs')
    .insert({
      title: req.body.title,
      lyrics: req.body.lyrics,
      user_id: req.body.user_id,
      song_file: uploadedSong.filename,
      votes: 0,
      song_date: new Date()
    });
  }).then(() => {
    res.status(200).json({song: uploadedSong.filename})
  }).catch((error) => {
    console.error('Error submitting new song in Database', error);
    res.status(500).json({error: 'Server Status  Error'})
  })
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


