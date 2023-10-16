import express from 'express';
const server = express();
const port = 3000;
import knex from 'knex';

// const db = knex({
//   client: 'pg', 
//   connection: {
//     host: 'your_database_host',
//     user: 'your_database_user',
//     password: 'your_database_password',
//     database: 'your_database_name',
//   },
//   // Other Knex configuration options
// });

server.use(express.json());

server.get('/', (req, res) => {
    res.send("home page baby!")
})




server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });