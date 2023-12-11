import { Router } from 'express'
import multer from 'multer'
import dropboxConfig from '../services/dropbox.js'
import databaseConfig from '../database/db.js'
const { db } = databaseConfig
const { dbx, isAccessTokenValid, refreshToken } = dropboxConfig
const songRoutes = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createSharedLink = async(req) => {
  let token = req.cookies.token
  const user = req.cookies.user
  // console.log('server user cookie: ', user)
  // console.log('server token cookie: ', token)
  if (!(await isAccessTokenValid(token))) {
    // console.log('expired, sending 4 new token')
    token = await refreshToken(user.user_id, token);
    // console.log(token)
  }
  await dbx.auth.setAccessToken(token)

  const uploadedSong = req.file;
  // console.log('uploadedSong: ', uploadedSong)

  const content = uploadedSong.buffer;

  let databaseLink;
  
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
      return databaseLink
    } else {
      const linkResponse = await dbx.sharingCreateSharedLinkWithSettings({
        path: dropboxResponse.result.path_display,
        settings: { requested_visibility: { '.tag': 'public' } },
      });

      databaseLink = linkResponse.result.url.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
      // console.log('Shareable link:', databaseLink);
      return databaseLink
    }
  } catch (error) {
    console.error('Error creating/shared link:', error);
  }
}

songRoutes.post('/submit-song', upload.single('song'), async (req, res) => {
  const databaseLink = await createSharedLink(req);
  console.log('databaseLink: ', databaseLink)
  try {
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

songRoutes.post('/submit-music', upload.single('song'), async(req, res) => {
  const databaseLink = await createSharedLink(req);
  try {
    const [newMusicId] = await db('music')
      .insert({
        title: req.body.title,
        user_id: req.body.user_id,
        song_file: databaseLink})
      .returning('music_id');
    await db('feed')
    .insert({
      type: 'music',
      user_id: req.body.user_id,
      music_id: newMusicId.music_id
    })
    res.status(200).json({ newMusic: databaseLink })
  }
  catch (error) {
    console.error('Error submitting new music in Database', error);
    res.status(500).json({ error: 'Server Status  Error' })
  }
});

songRoutes.post('/submit-lyrics', async(req, res) => {
const title = req.body.title;
const lyrics = req.body.lyrics;
const id = req.body.title.user_id
try {
  const [newLyricId] = await db('lyrics').insert({
    title: title,
    user_id: id,
    lyrics: lyrics})
    .returning('lyric_id');

    await db('feed')
    .insert({
      type: 'lyrics',
      user_id: req.body.user_id,
      lyric_id: newLyricId.lyric_id
    })
   res.status(200).json({ newLyrics: req.body.lyrics })
} catch (error) {
  console.error('Error submitting new lyrics in Database', error);
  res.status(500).json({ error: 'Server Status  Error' })
}
});


export default songRoutes