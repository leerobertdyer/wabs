import express from 'express';
import cors from 'cors'
import profileRoutes from './routes/profileRoutes.js';
import songRoutes from './routes/songRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dbConfig from './database/db.js'
import cookieSession from 'cookie-session';
const {client, db} = dbConfig
const server = express();
const port = 4000;

/////////// Middleware ////////////
server.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000', // Update this when deploying
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

server.use(cors(corsOptions));

server.use(
  cookieSession({
    name: 'Bob Cookie:',
    secret: 'myfuckingsecret',
    saveUninitialized: false,
    resave: false,
    cookie: { 
      maxAge: 1000 * 60 * 5, //five minute session for testing. I want my cookies to expire 
      secure: false, //will need to change this for deploy
      sameSite: 'None', 
      httpOnly: true,
    },
  })
);
            //////ROUTES//////
// home feed should display a variety of things: newest song submissions, collabs, and status updates
server.use('/profile', profileRoutes)
server.use('/', songRoutes)
server.use('/auth', authRoutes)












server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


