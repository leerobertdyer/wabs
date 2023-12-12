import knex from "knex";
import pg from 'pg'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const client = new pg.Client({
    connectionString: process.env.ELEPHANTSQL_URL,
    ssl: false // CHANGE THIS WHEN DEPLOYING!!!
  });
  
  client.connect()
  .then(() => console.log('Connected to ElephantSQL', client.database))
  .catch((err) => {
    console.error('Error connecting to ElephantSQL:', err)
  }).then(() => {
    client.end()
  });

const db = knex({
    client: 'pg',
    connection: process.env.ELEPHANTSQL_URL,
    pool: {
      min: 2, 
      max: 5, 
      idleTimeoutMillis: 6000, 
    },
  });
  

  export default { client, db };