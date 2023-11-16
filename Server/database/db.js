import knex from "knex";
import dotenv from 'dotenv'
import pg from 'pg'
import session from 'express-session';
const KnexSessionStore = (await import('connect-session-knex')).default(session);

dotenv.config({ path: '../.env' });

const client = new pg.Client({
    connectionString: process.env.ELEPHANTSQL_URL,
    ssl: false // CHANGE THIS WHEN DEPLOYING!!!
  });
  
  client.connect()
  .then(() => console.log('Connected to ElephantSQL', client.database))
  .catch((err) => {
    console.error('Error connecting to ElephantSQL:', err)
  });

const db = knex({
    client: 'pg',
    connection: process.env.ELEPHANTSQL_URL,
  });
  
  const sessionStore = new KnexSessionStore({
    knex: db, 
    tablename: 'session', 
    sidfieldname: 'sid',
  });

  export default { client, db, sessionStore };