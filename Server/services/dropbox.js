import { Dropbox } from "dropbox";
import multer from "multer";
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
import 'isomorphic-fetch';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const APP_KEY = process.env.DROPBOX_APP_KEY
const APP_SECRET = process.env.DROPBOX_APP_SECRET
const REDIRECT_URI = 'http://localhost:4000/auth/dbx-auth-callback'
const dbx = new Dropbox({ clientId: APP_KEY, clientSecret: APP_SECRET, fetch });

export default {dbx, REDIRECT_URI}