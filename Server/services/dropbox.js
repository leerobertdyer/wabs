import { Dropbox, DropboxAuth } from "dropbox";
import multer from "multer";
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'
import databaseConfig from '../database/db.js'
const { db } = databaseConfig
import 'isomorphic-fetch';
import axios from "axios";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
const APP_KEY = process.env.DROPBOX_APP_KEY
const APP_SECRET = process.env.DROPBOX_APP_SECRET
const REDIRECT_URI = 'http://localhost:4000/auth/dbx-auth-callback'
const dbx = new Dropbox({ clientId: APP_KEY, clientSecret: APP_SECRET, fetch });

const isAccessTokenValid = async (accessToken) => {
    try {
        const dbxClient = new Dropbox({ clientId: APP_KEY, clientSecret: APP_SECRET, accessToken: accessToken });
        const accountInfo = await axios.post('https://api.dropboxapi.com/2/check/user', headers={
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": 'application/json'
        })
        console.log(accountInfo)
        return true;
    } catch (error) {
        console.error(`Token has expired, getting new one... ${error}`);
        return false;
    }
};

const refreshToken = async (user_id, token) => {
    try {
        const { refresh } = await db('dbx_tokens')
            .select('refresh')
            .where('user_id', user_id)
            .first();

        const dbx = new DropboxAuth({
            accessToken: token,
            clientId: process.env.DROPBOX_APP_KEY,
            clientSecret: process.env.DROPBOX_APP_SECRET,
            refreshToken: refresh
        })

        async function getNewAccessToken() {
            try {
                const params = new URLSearchParams();
                params.append('grant_type', 'refresh_token');
                params.append('refresh_token', refresh);
                params.append('client_id', process.env.DROPBOX_APP_KEY);
                params.append('client_secret', process.env.DROPBOX_APP_SECRET);
        
                const response = await axios.post(
                    'https://api.dropboxapi.com/oauth2/token',
                    params.toString(),
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                    }
                );
        
                // console.log('New Access Token:', response.data.access_token);
                const newToken = response.data.access_token
                return newToken
            } catch (error) {
                console.error('Error refreshing token:', error.response.data);
            }
        }
        
        const newAccessToken = await getNewAccessToken();

        await db('dbx_tokens')
            .where('user_id', user_id)
            .update({ token: newAccessToken });

        return newAccessToken

    }
    catch (error) {
        console.error('Error updating dbx_tokens: ', error)
    }

}

export default { dbx, REDIRECT_URI, isAccessTokenValid, refreshToken }