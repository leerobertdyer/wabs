import express from 'express';
import cors from 'cors'
import session from 'express-session'; 
import profileRoutes from './routes/profileRoutes.js';
import songRoutes from './routes/songRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dbConfig from './database/db.js'
const {client, db, sessionStore} = dbConfig
const server = express();
const port = 4000;

/////////// Middleware ////////////
server.use(
  session({
    name: 'Bobsession',
    secret: process.env.SESSION_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60, 
      secure: false, //will need to change this for deploy
      sameSite: 'None', 
      resave: false,
      httpOnly: true,
    },
    store: sessionStore,
    
  })
);

server.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000', // Update this when deploying
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

server.use(cors(corsOptions));

            //////ROUTES//////
// home feed should display a variety of things: newest song submissions, collabs, and status updates
server.use('/profile', profileRoutes)
server.use('/', songRoutes)
server.use('/auth', authRoutes)
server.get('/check-session', (req, res) => {
  if (req.session){
    console.log('session Id', req.sessionID)
    console.log('session = ', req.session)
  }
});











server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


