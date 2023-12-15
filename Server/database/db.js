import knex from "knex";
import pg from 'pg'
import { ELEPHANTSQL_URL } from "../config.js";

const client = new pg.Client({
    connectionString: ELEPHANTSQL_URL,
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
    connection: ELEPHANTSQL_URL,
    pool: {
      min: 2, 
      max: 5, 
      idleTimeoutMillis: 12000, 
    },
  });
  

  export default { client, db };