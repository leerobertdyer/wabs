import { Router } from 'express'
import multer from 'multer'
import dropboxConfig from '../services/dropbox.js'
import databaseConfig from '../database/db.js'
const { db } = databaseConfig
const { dbx, isAccessTokenValid, refreshToken } = dropboxConfig
const songRoutes = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

songRoutes.get('/songs', async (req, res) => {
  const { userId, home } = req.query
  let songs
  if (home) {
    try {
      songs = await db('songs').select('*')
      res.json({ songs })
    } catch (error) {
      console.error("Error getting songs from database (homepage)", error)
    }
  }
  else if (userId) {
    try {
      songs = await db('songs')
        .where('user_id', Number(userId))
      res.json({ songs })
    } catch (error) {
      console.error(`Error obtaining songs from database (profile): ${error}`)
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    console.log('songRoutes/song failed due to query not existing...')
    res.status(500).json({ error: 'Internal service error (songRoutes.js)' })
  }
})

songRoutes.post('/submit', upload.single('song'), async (req, res) => {
  const token = req.cookies.token
  const user = req.cookies.user
  // this is the logic for checking if the token... put this back after testing...
  // if (!(await isAccessTokenValid(token))) {
  //   console.log('token no longer valid...')
  //   const userId = req.cookies.user.user_id;
  //   console.log('user id: ', userId)
  //   const newToken = await refreshToken(userId);
  //   console.log('new token: ', newToken)
  //   dbx.auth.setAccessToken(newToken);
  // } else {
  //   dbx.auth.setAccessToken(token);
  //   console.log('current token allowed')
  // }
  
    dbx.auth.setAccessToken(token); //setting the user for dbx

    const { refresh } = await db('dbx_tokens')
        .select('refresh')
        .where('user_id', user.user_id)
        .first();

    const tokenResponse = await dbx.auth.refreshAccessToken();
    console.log("tokenResponse: ", tokenResponse)
    const newAccessToken = tokenResponse.result.access_token;

    await db('dbx_tokens')
    .where('user_id', user.user_id)
    .update({ token: newAccessToken});

    console.log('new token: ', newToken)
    dbx.auth.setAccessToken(newToken);




  const uploadedSong = req.file;
  console.log('uploadedSong: ', uploadedSong)

  if (!uploadedSong) {
    return res.status(400).json({ error: 'No song provided' });
  }

  const content = uploadedSong.buffer;

  let databaseLink;
  try {
    const dropboxResponse = await dbx.filesUpload({
      path: `/uploads/songs/${uploadedSong.originalname}`,
      contents: content
    });
    console.log('dpx resp: ', dropboxResponse);
    const dropboxPath = dropboxResponse.result.id;
    // console.log('dpx path: ', dropboxPath)

    try {
      const existingLinkResponse = await dbx.sharingListSharedLinks({
        path: dropboxResponse.result.path_display
      });

      if (existingLinkResponse.result.links.length > 0) {
        databaseLink = existingLinkResponse.result.links[0].url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
        console.log('Using existing shareable link:', databaseLink);
      } else {
        const linkResponse = await dbx.sharingCreateSharedLinkWithSettings({
          path: dropboxResponse.result.path_display,
          settings: { requested_visibility: { '.tag': 'public' } },
        });

        databaseLink = linkResponse.result.url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
        console.log('Shareable link:', databaseLink);
      }
    } catch (error) {
      console.error('Error creating/shared link:', error);
    }
    await db('songs')
      .insert({
        title: req.body.title,
        lyrics: req.body.lyrics,
        user_id: req.body.user_id,
        song_file: databaseLink,
        votes: 0,
        song_date: new Date()
      });
    res.status(200).json({ song: uploadedSong.filename })
  }
  catch (error) {
    console.error('Error submitting new song in Database', error);
    res.status(500).json({ error: 'Server Status  Error' })
  }
});


export default songRoutes