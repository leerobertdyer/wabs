import { Router } from "express";
import multer from 'multer';
import dbConfig from '../database/db.js'
const { db } = dbConfig
import dropboxConfig from '../services/dropbox.js'
const { dbx, isAccessTokenValid, refreshToken } = dropboxConfig
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const profileRoutes = Router() 

profileRoutes.put('/update-status', async (req, res) => {
  try {
    const { id, newStatus } = req.body
    req.cookies.user.user_status = newStatus
    await db('users')
      .where('user_id', id)
      .update({ user_status: newStatus })
    await db('feed')
    .insert(
      {type: 'status',
      user_id: id,
      feed_status: newStatus
    })
      res.cookie('user', req.cookies.user, { maxAge: 3000000, httpOnly: true, path: '/' });
        res.status(200).json({ status: newStatus })
      } catch(error) {
        console.error('Error setting new status in Database', error);
        res.status(500).json({ error: 'Server Status Error' })
      }
  });

  profileRoutes.put('/upload-profile-pic', upload.single('photo'), async (req, res) => {
    let token = req.cookies.token
    const user = req.body.user_id;
  if (!(await isAccessTokenValid(token))) {
    console.log('Fix isAccessTokenValid, sending 4 new token')
    token = await refreshToken(user, token);
  }

    await dbx.auth.setAccessToken(token);
    const uploadedPhoto = req.file;

    if (!uploadedPhoto) {
      return res.status(400).json({ error: 'No profile photo provided' });
    }

    const contents = uploadedPhoto.buffer;
    let databaseLink;
    try {
      const dropboxResponse = await dbx.filesUpload({
        path: `/uploads/photos/${uploadedPhoto.originalname}`,
        contents: contents
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
  
      await db('users')
        .where('user_id', user)
        .update({ user_profile_pic: databaseLink })
      await db('feed')
      .insert({
        type: 'profile_pic',
        user_id: user,
        feed_pic: databaseLink
      })
      req.cookies.user.user_profile_pic = databaseLink
      res.cookie('user', req.cookies.user, { maxAge: 3000000, httpOnly: true, path: '/' });
      res.status(200).json({ newPhoto: databaseLink })
    } catch (error) {
      console.error('Error updating Database: ', error);
      res.status(500).json({ error: 'Server XXXX Error' })
    }
  });
  

export default profileRoutes