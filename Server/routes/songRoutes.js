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
  let songData
  try {
      const songData = await db('songs')
        .join('users', 'songs.user_id', '=', 'users.user_id')
        .select('songs.*', 'users.user_profile_pic', 'users.username')
      res.json({ songs: songData })
    }
  catch (error) {
    console.error(`Error obtaining user songs from database: ${error}`)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

songRoutes.post('/submit', upload.single('song'), async (req, res) => {
  let token = req.cookies.token
  const user = req.cookies.user
  if (!(await isAccessTokenValid(token))) {
    // console.log('expired, sending 4 new token')
    token = await refreshToken(user.user_id, token);
    // console.log(token)
  }
  await dbx.auth.setAccessToken(token)

  const uploadedSong = req.file;
  // console.log('uploadedSong: ', uploadedSong)

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
    // console.log('dpx resp: ', dropboxResponse);
    const dropboxPath = dropboxResponse.result.id;
    // console.log('dpx path: ', dropboxPath)

    try {
      const existingLinkResponse = await dbx.sharingListSharedLinks({
        path: dropboxResponse.result.path_display
      });

      if (existingLinkResponse.result.links.length > 0) {
        databaseLink = existingLinkResponse.result.links[0].url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
        // console.log('Using existing shareable link:', databaseLink);
      } else {
        const linkResponse = await dbx.sharingCreateSharedLinkWithSettings({
          path: dropboxResponse.result.path_display,
          settings: { requested_visibility: { '.tag': 'public' } },
        });

        databaseLink = linkResponse.result.url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
        // console.log('Shareable link:', databaseLink);
      }
    } catch (error) {
      console.error('Error creating/shared link:', error);
    }
    const [newSongId] = await db('songs')
      .insert({
        title: req.body.title,
        lyrics: req.body.lyrics,
        user_id: req.body.user_id,
        song_file: databaseLink,
        votes: 0})
      .returning('song_id');
    await db('feed')
    .insert({
      type: 'song',
      user_id: req.body.user_id,
      song_id: newSongId.song_id
    })
    res.status(200).json({ newSong: databaseLink })
  }
  catch (error) {
    console.error('Error submitting new song in Database', error);
    res.status(500).json({ error: 'Server Status  Error' })
  }
});


export default songRoutes