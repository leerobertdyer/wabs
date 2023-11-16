import bcrypt from 'bcrypt'
import databaseConfig from '../database/db.js'
import { Router } from 'express'
import session from 'express-session'
import dropboxConfig from '../services/dropbox.js'
const { dbx, REDIRECT_URI } = dropboxConfig
const { client, db, sessionStore } = databaseConfig

const authRoutes = Router()

////////////////    Test    ////////////////
authRoutes.get('/check-session', (req, res) => {
  if (req.session){
    console.log('session = ', req.session);
    res.status(200).json({ session: req.session });
  } else {
    console.log('no session');
    res.status(200).json({ session: null });
  }
});
////////////////    DBX    ////////////////

authRoutes.post('/dbx-auth', async (req, res) => {
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

authRoutes.get('/dbx-auth-callback', async (req, res) => {
  const { code } = req.query;
  try {
    // console.log('received auth code: ', code)
    if (tempAuthToken === '') {
      const tokenResponse = await dbx.auth.getAccessTokenFromCode(REDIRECT_URI, code);
      // console.log('token response: ', tokenResponse)
      tempAuthToken = tokenResponse.result.access_token;
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

////////////////    login    ////////////////

authRoutes.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.select('*')
      .from('users')
      .where('user_email', '=', email.toLowerCase())
      .then(userData => {
        if (userData.length === 0) {
          return res.status(400).json('no email Creds Bro');
        }
        const user = userData[0];
        return db.select('hash')
          .from('login')
          .where('user_id', '=', user.user_id)
          .then(loginData => {
            if (loginData.length === 0) {
              return res.status(400).json('Insufficient Creds Bro, database err');
            }
            bcrypt.compare(password, loginData[0].hash, (err, result) => {
              if (result) {
                req.session.user = user;
                    console.log('Session data:', req.session);
                    res.json(userData[0]);
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

////////////////    Register    ////////////////

  authRoutes.post('/register', (req, res) => {
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
            user_profile_pic: 'https://dl.dropboxusercontent.com/scl/fi/y7kg02pndbzra2v0hlg15/logo.png?rlkey=wzp1tr9f2m1z9rg1j9hraaog6&dl=0'
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

////////////////    Signout    ////////////////

  authRoutes.post('/signout', (req, res) => {
    req.session = null
  });
  

  export default authRoutes 
  