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
server.use(cors({ origin: 'http://localhost:3001' }));

server.get('/', (req, res) => {
    db.select('*').from('users')
    .then(data => {
        console.log(data)
        res.json(data)
    })
})

server.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === 'john' && password === '123') {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Login failed' });
    }
  });


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });