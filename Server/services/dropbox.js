import { Dropbox } from "dropbox";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const APP_KEY = process.env.DROPBOX_APP_KEY
const APP_SECRET = process.env.DROPBOX_APP_SECRET
const REDIRECT_URI = 'http://localhost:4000/auth-callback'
const dbx = new Dropbox({ clientId: APP_KEY, clientSecret: APP_SECRET, fetch });

export default {dbx, REDIRECT_URI}