import { Router } from 'express'
import multer from 'multer'
import { Readable } from 'stream';
import dropboxConfig from '../services/dropbox.js'
const { dbx, REDIRECT_URI } = dropboxConfig
const songRoutes = Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

songRoutes.post('/submit', upload.single('song_file'), async (req, res) => {
    const uploadedSong = req.file;
    console.log('uploadedSong: ', uploadedSong)
    if (!uploadedSong) {
      return res.status(400).json({ error: 'No song provided' });
    }
    const songFileStream = Readable.from(uploadedSong.buffer);
    console.log('buffer size: ', uploadedSong.buffer.length)
    let databaseLink;
    try {
      console.log('works here')
      const dropboxResponse = await dbx.filesUpload({
        path: `/uploads/songs/${uploadedSong.originalname}`,
        contents: songFileStream
      });
      console.log('dropboxResponse: ', dropboxResponse);
      const dropboxPath = dropboxResponse.result.id
      console.log('dpx path: ', dropboxPath)
      try {
        const linkResponse = await dbx.sharingCreateSharedLinkWithSettings({
          path: dropboxResponse.result.path_display,
          settings: { requested_visibility: { '.tag': 'public' } },
        });
        const shareableLink = linkResponse.result.url;
        databaseLink = shareableLink.replace('https://www.dropbox.com', 'https://dl.dropboxusercontent.com');
        // console.log('Shareable link:', shareableLink);
        // console.log('Database link: ', databaseLink)
      } catch (error) {
        console.error('Error creating shared link:', error);
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