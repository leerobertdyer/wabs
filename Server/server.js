import express from 'express';
import cors from 'cors'
const server = express();
const port = 4000;
import bcrypt from 'bcrypt';
import knex from 'knex';

const db = knex({
  client: 'pg', 
  connection: {
    host: '127.0.0.1',
    user: '',
    password: '',
    database: 'wabs',
  },
  // Other Knex configuration options
});

server.use(express.json());

server.use(cors({ origin: 'http://localhost:3000' }));

server.get('/', (req, res) => { //not sure I need this...
    db.select('*').from('users')
    .then(data => {
        res.json(data)
    })
})

server.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Step 1: Retrieve user data from the 'users' table based on the email.
  db.select('*')
    .from('users')
    .where('email', '=', email)
    .then(userData => {
      if (userData.length === 0) {
        // no length == no data...
        return res.status(400).json('no email Creds Bro');
      }

      const userId = userData[0].id;

      // Step 2: Use the 'id' to fetch the hashed password from the 'login' table.
      return db.select('hash')
        .from('login')
        .where('userid', '=', userId)
        .then(loginData => {
          if (loginData.length === 0) {
            // This user doesn't have login data; something's wrong.
            return res.status(400).json('Insufficient Creds Bro, database err');
          }

          // Step 3: Compare the hashed password from the request with the one in the 'login' table.
          bcrypt.compare(password, loginData[0].hash, (err, result) => {
            if (result) {
              return db.select('*')
                .from('users')
                .where('id', '=', userId)
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
      res.status(400).json('Wrong Creds Bro');
    });
});


  server.post('/register', (req, res) => {
    const { email, username, password } = req.body;
if (email || username || password) {
  console.log(email, username, password)
}
console.log('Received data:', req.body);
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.log('Error hashing password', err);
      }
  
      db.transaction((trx) => {
        trx('users')
          .returning('id')
          .insert({
            email: email,
            username: username,
            datecreated: new Date(),
            score: 0
          })
          .then((userIds) => {
            const userId = userIds[0].id;
            return trx('login')
              .returning('id')
              .insert({
                hash: hash,
                userid: userId, // Set the 'userid' explicitly
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

  
server.put('/submit', (req, res) => { //handle new song submissions
  //will need to study up transactions to ensure it updates the user score and the songs database
  //this is also where any ai api would go...

})


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });