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

const isAccessTokenValid = async (accessToken) => {
    try {
        const dbxClient = new Dropbox({ accessToken });
        const accountInfo = await dbxClient.usersGetCurrentAccount();
        return true;
    } catch (error) {
        console.error(`Error validating access token: ${error}`);
        return false;
    }
};

const refreshToken = async (user_id) => {
    try {
        const { refresh } = await db('dbx_tokens')
        .select('refresh')
        .where('user_id', user_id)
        .first();
    
    const tokenResponse = await dbx.auth.refreshAccessToken(refresh);
    const newAccessToken = tokenResponse.result.access_token;

    await db('dbx_tokens')
    .where('user_id', user_id)
    .update({ token: newAccessToken});

    return newAccessToken
}
    catch (error) {
        console.error('Error refreshing access token: ', error)
    }

}

export default {dbx, REDIRECT_URI, isAccessTokenValid, refreshToken}