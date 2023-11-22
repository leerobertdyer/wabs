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
  let songs
  if (false) {
    console.log('home achieved')
    try {
      songs = await db('songs')
      .select('*')
      //add a sort by query later
      console.log(songs)
    } catch (error) {
      console.error("Error getting songs from database (homepage)", error)
    }
  }
  else if (true) {
    try {
      const songData = await db('songs')
      .join('users', 'songs.user_id', '=', 'users.user_id')
      .select('songs.*', 'users.user_profile_pic');
    
      res.json({ songs, photos })
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
  let token = req.cookies.token
  const user = req.cookies.user
  console.log('user cookie: ', user)
  console.log('token cookie: ', token)

  if (!( await isAccessTokenValid(token))){
    console.log('expired, sending 4 new token')
    token = await refreshToken(user.user_id, token);
    console.log(token)
  }

  await dbx.auth.setAccessToken(token)

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