import { Router } from 'express'
import databaseConfig from '../database/db.js'
const { db } = databaseConfig

const feedRoutes = Router();

feedRoutes.get('/feed', async (req, res) => {
    try {
        const newFeed = await db('feed')
            .leftJoin('users', 'feed.user_id', '=', 'users.user_id')
            .leftJoin('songs', 'feed.song_id', '=', 'songs.song_id')
            .leftJoin('music', 'feed.music_id', '=', 'music.music_id')
            .leftJoin('lyrics', 'feed.lyric_id', '=', 'lyrics.lyric_id')
            .select('*')
            .orderBy('time', 'desc')
        res.status(200).json({ newFeed: newFeed })
    } catch (error) {
        console.error(`Trouble getting feed from database: ${error}`)
    }
});

feedRoutes.get('/feed-collab', async (req, res) => {
    try {
        const allMusic = await db('feed')
            .innerJoin('music', 'feed.music_id', '=', 'music.music_id')
            .innerJoin('users', 'feed.user_id', '=', 'users.user_id')
            .select('*')
        const allLyrics = await db('feed')
            .innerJoin('lyrics', 'feed.lyric_id', '=', 'lyrics.lyric_id')
            .innerJoin('users', 'feed.user_id', '=', 'users.user_id')
            .select('*')
        const collabFeed = []
        for (const item of allMusic) {
            collabFeed.push(item)
        }
        for (const item of allLyrics) {
            collabFeed.push(item)
        }
        collabFeed.sort((a, b) => a.time - b.time)

        // console.log(collabFeed);
        res.status(200).json({ collabFeed: collabFeed })
    } catch (err) {
        console.error(`Trouble fetching collab feed ${err}`);
    }
});

feedRoutes.get('/get-stars', async (req, res) => {
    const id = req.query.id;
    const stars = await db('stars').select('post_id').where('user_id', id)
    res.status(200).json({ userStars: stars })
});

feedRoutes.put('/update-stars', async (req, res) => {
    const postId = req.query.postId
    const userId = req.query.userId

    const existingStar = await db('stars')
        .where({ post_id: postId, user_id: userId })
        .first();

    if (existingStar) {
        await db('stars').where({ post_id: postId, user_id: userId }).del();
        await db('feed').where('feed_id', postId).decrement('stars', 1)
        res.status(200).json({ message: 'un-starred', post: postId })
    } else {
        await db('stars').insert({ post_id: postId, user_id: userId })
        await db('feed').where('feed_id', postId).increment('stars', 1)
        res.status(200).json({ message: 'starred', post: postId });
    }
});

feedRoutes.delete('/delete-post', async (req, res) => {
    const feed_id = req.query.feed_id;
    const feed_type = req.query.feed_type;
    const user_id = req.query.user_id;
    const authorized = await db('feed')
        .where('user_id', user_id).andWhere('feed_id', feed_id)
        .select('*')
    if (authorized.length > 0) {
        try {
            try {
                await db('stars')
                    .where('post_id', feed_id)
                    .del();
            } catch (err) {
                console.error(`Either no stars in db, or error deleting ${err.message}`)
            }
            if (feed_type === "song") {
                try {
                    const songIdData = await db('feed')
                        .where('feed_id', feed_id)
                        .returning('song_id')
                        .del()

                    const songId = songIdData[0].song_id

                    if (songId) {
                        const dbx_url = await db('songs')
                            .where('song_id', songId)
                            .returning('song_file')
                            .del()
                        //*********** *********** *********** ***********//
                        //*********** Handle DBX DELETE HERE ***********//
                        //*********** *********** *********** ***********//
                    }
                } catch (err) {
                    console.error(`Error deleting from feed or songs table, ${err.message}`)
                }
            } else if (feed_type === "status" || feed_type === "profile_pic") {
                try {
                    await db('feed')
                        .where('feed_id', feed_id)
                        .del()
                } catch (err) {
                    console.error(`Error deleting status from feed table: ${err}`)
                }
            } else if (feed_type === "music") {
                try {
                    const musicIdData = await db('feed')
                        .where('feed_id', feed_id)
                        .returning('music_id')
                        .del()

                    const musicId = musicIdData[0].song_id

                    if (musicId) {
                        const dbx_url = await db('music')
                            .where('music_id', musicId)
                            .returning('song_file')
                            .del()
                        //*********** *********** *********** ***********//
                        //*********** Handle DBX DELETE HERE ***********//
                        //*********** *********** *********** ***********//
                    }
                } catch (err) {
                    console.error(`Error deleting from feed or music table, ${err.message}`)
                }
            } else if (feed_type === "lyrics") {
                const lyricId = await db('feed')
                .where('feed_id', feed_id)
                .returning('lyric_id')
                .del()
                await db('lyrics')
                .where('lyric_id', lyricId)
                .delete()
            }
            res.status(200).json({ message: `Post ${feed_id} deleted.` });
        } catch (err) {
            console.error(`Error deleting post: ${err}`)
        }
    } else {
        console.log("Nice try, but this isn't your post buster");
    }
})


export default feedRoutes