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
import { Readable } from 'stream';
import { start } from 'repl';
import session from 'express-session';

dotenv.config({ path: '../.env'});


const oneDay = 1000 * 60 * 60 * 24;
server.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    //store: eventually will need one connect-pg-simple maybe...
    resave: false 
}));

const client = new pg.Client({
  connectionString: process.env.ELEPHANTSQL_URL,
  ssl: false // CHANGE THIS WHEN DEPLOYING!!!
});

client.connect()
  .then(() => console.log('Connected to ElephantSQL', client.database))
  .catch((err) => {
    console.error('Error connecting to ElephantSQL:', err)});

const APP_KEY = process.env.DROPBOX_APP_KEY
const APP_SECRET = process.env.DROPBOX_APP_SECRET
const REDIRECT_URI = 'http://localhost:4000/auth-callback'
const REDIRECT_URI_CALLBACK = 'http://localhost:4000/auth-final'
const dbx = new Dropbox({ clientId: APP_KEY, clientSecret: APP_SECRET, fetch });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage});

const db = knex({
  client: 'pg', 
  connection: process.env.ELEPHANTSQL_URL
});

server.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000', // Update this when deploying
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
server.use(cors(corsOptions));

server.use('/uploads', express.static('uploads'));

server.get('/', (req, res) => { // home feed should display a variety of things: newest song submissions, collabs, and status updates
    db.select('*').from('users')
    .then(data => {
      console.log(data)
        res.json(data)
    })
})

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
            user_profile_pic: 'https://dl.dropboxusercontent.com/scl/fi/p2wxffl51e50wybb5nrz1/logo.png?rlkey=hkgaocdy6duq4ze2w9b3tvhkq&dl=0'
          })
          .then((user) => {
            const userData = user[0]; 
            const userId = user[0].user_id;
            return trx('login')
              .returning('*')
              .insert({
                hash: hash,
                user_id: userId, 
              })
          .then((user) => {
            trx.commit();
            res.json(userData);
          });
        })
              .catch((err) => {
                trx.rollback();
                res.status(400).json({ error: 'Unable to register1', message: err.message });
              });
          })
          
      });
    });

server.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.select('*')
      .from('users')
      .where('user_email', '=', email.toLowerCase())
      .then(userData => {
        if (userData.length === 0) {
          return res.status(400).json('no email Creds Bro');
        }
        const userId = userData[0].user_id;
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
    
server.post('/auth', async (req, res) => {
  try {
    const authUrl = await dbx.auth.getAuthenticationUrl(REDIRECT_URI, null, 'code', 'offline');
    // console.log('Authorization URL:', authUrl);
    res.json({ authUrl: authUrl })
  } catch (error) {
    console.error('Error generating authentication URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

let tempAuthToken = ''

server.get('/auth-callback', async (req, res) => {
  const { code } = req.query;
  try {
    // console.log('received auth code: ', code)
    if (tempAuthToken === '') {
      const tokenResponse = await dbx.auth.getAccessTokenFromCode(REDIRECT_URI, code);
      // console.log('token response: ', tokenResponse)
      tempAuthToken  = tokenResponse.result.access_token;
      // console.log('accessToken: ', (tempAuthToken));
      res.redirect(`http://localhost:3000/access?accessToken=${tempAuthToken}`)
      tempAuthToken = ''
    }
    else {
      console.log("token obtained, mission partial success..")
      res.redirect(`http://localhost:3000/access?accessToken=${token}`)
    }
  } catch (error) {
    console.error('Error obtaining access token:', error);
    res.status(500).json({ error: 'Failed to obtain access token' });
  }
});


server.post('/submit', upload.single('song_file'), async (req, res) => {
  const uploadedSong = req.file;
  console.log('uploadedSong: ', uploadedSong)
  if (!uploadedSong) {
    return res.status(400).json({ error: 'No song provided' });
  }
  const songFileStream = Readable.from(uploadedSong.buffer); 
  console.log('buffer size: ', uploadedSong.buffer.length)
  let databaseLink;
  try {
    console.log('works here')
    const dropboxResponse = await dbx.filesUpload({
      path: `/uploads/songs/${uploadedSong.originalname}`,
      contents: songFileStream
    });
    console.log('dropboxResponse: ', dropboxResponse);
    const dropboxPath = dropboxResponse.result.id
    console.log('dpx path: ', dropboxPath)
    try {
      const linkResponse = await dbx.sharingCreateSharedLinkWithSettings({
        path: dropboxResponse.result.path_display,
        settings: { requested_visibility: { '.tag': 'public' } },
      });
      const shareableLink = linkResponse.result.url;
      databaseLink = shareableLink.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
      // console.log('Shareable link:', shareableLink);
      // console.log('Database link: ', databaseLink)
    } catch (error) {
      console.error('Error creating shared link:', error);
    }
    await db('songs')
    .insert({
      title: req.body.title,
      lyrics: req.body.lyrics,
      user_id: req.body.user_id,
      song_file: databaseLink,
      votes: 0,
      song_date: new Date()
    });
    res.status(200).json({song: uploadedSong.filename})
  }
  catch(error) {
    console.error('Error submitting new song in Database', error);
    res.status(500).json({error: 'Server Status  Error'})
  }
});


server.put('/upload-profile-pic', upload.single('photo'), async (req, res) => {
  const user  = req.body.user_id;
  const uploadedPhoto = req.file;
   if (!uploadedPhoto) {
    return res.status(400).json({ error: 'No profile photo provided' });
  }
  const photoFileStream = Readable.from(uploadedPhoto.buffer)
  let databaseLink;
  try {
  const dropboxResponse = await dbx.filesUpload({
    path: `/uploads/photos/${uploadedPhoto.originalname}`,
    contents: photoFileStream
  });
  console.log(dropboxResponse);
  const dropboxPath = dropboxResponse.result.id;
  console.log('dpx path: ', dropboxPath)
  try {
    const linkResponse = await dbx.sharingCreateSharedLinkWithSettings({
      path: dropboxResponse.result.path_display,
      settings: { requested_visibility: {'.tag.tag': 'public' } },
    });
    const shareableLink = linkResponse.result.url;
    databaseLink = shareableLink.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
    // console.log('Shareable link:', shareableLink);
    // console.log('Database link: ', databaseLink)
  } catch (error) {
    console.error('Error creating shared link:', error);
  }

  await db('users')
  .where('user_id', user)
  .update({user_profile_pic: databaseLink})
  
res.status(200).json({newPhoto: databaseLink})
} catch(error) {
    console.error('Error updating Database: ', error);
    res.status(500).json({error: 'Server XXXX Error'})
  }
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

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


