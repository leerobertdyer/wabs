import express from 'express';
import cors from 'cors'
import profileRoutes from './routes/profileRoutes.js';
import songRoutes from './routes/songRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dbConfig from './database/db.js'
import cookieParser from 'cookie-parser';
import feedRoutes from './routes/feedRoutes.js';

const { db} = dbConfig
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
server.use(cookieParser())

            //////ROUTES//////
// home feed should display a variety of things: newest song submissions, collabs, and status updates
server.use('/profile', profileRoutes)
server.use('/', songRoutes)
server.use('/auth', authRoutes)
server.use('/', feedRoutes)

process.on('exit', () => {
  db.destroy();
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


