import { Router } from 'express'
import databaseConfig from '../database/db.js'
const { db } = databaseConfig

const feedRoutes = Router();

feedRoutes.get('/feed', async (req, res) => {
    try {
        const newFeed = await db('feed')
            .leftJoin('users', 'feed.user_id', '=', 'users.user_id')
            .leftJoin('songs', 'feed.song_id', '=', 'songs.song_id')
            .select('*')
            .orderBy('time', 'desc')
        res.status(200).json({ newFeed: newFeed })
    } catch (error) {
        console.error(`Trouble getting feed from database: ${error}`)
    }
})

feedRoutes.get('/get-stars', async (req, res) => {
    const id = req.query.id;
    const stars = await db('stars').select('post_id').where('user_id', id)
    res.status(200).json({ userStars: stars })
})

feedRoutes.put('/update-stars', async (req, res) => {
    const postId = req.query.postId
    const userId = req.query.userId
    
    const existingStar = await db('stars')
        .where({ post_id: postId, user_id: userId })
        .first();

    if (existingStar) {
        await db('stars').where({ post_id: postId, user_id: userId }).del();
        res.status(200).json({ message: 'un-starred', post: postId })
    } else {
        await db('stars').insert({ post_id: postId, user_id: userId })
        res.status(200).json({ message: 'starred', post: postId });
    }
})




export default feedRoutes