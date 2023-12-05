import { useState, useEffect } from "react";
import './Feed.css'

function Feed({ feed, user, loadFeed, sortFeed }) {
    const [sortBy, setSortBy] = useState('Latest')
    const [stars, setStars] = useState([])
    const page = window.location.href

    useEffect(() => {
        setSortBy('Latest')
        handleSort('Latest')
    }, [page])

    useEffect(() => {
        if (user.user_id) {
            getStars(user.user_id);
        }
    }, [user])

    const starHollow = '../../../Assets/star.png'
    const starFilled = '../../../Assets/starFilled.png'

    const getStars = async (id) => {
        const resp = await fetch(`http://localhost:4000/get-stars?id=${id}`, {
            credentials: 'include'
        })
        const data = await resp.json();
        const nextStars = data.userStars.map(star => Number(star.post_id))
        setStars(nextStars)
    }
    const updateStars = async (user_id, post_id) => {
        if (user.user_id > 0) {
            try {
                const resp = await fetch(`http://localhost:4000/update-stars?userId=${user_id}&postId=${post_id}`,
                    {
                        method: "put",
                        credentials: 'include'
                    })
                const data = await resp.json();
                // console.log('star checker: ', data);
                if (data.message === 'starred') {
                    const nextStars = [...stars, data.post]
                    setStars(nextStars);
                } else if (data.message === 'un-starred') {
                    const nextStars = stars.filter(star => star.feed_id !== data.post)
                    setStars(nextStars)
                }
                loadFeed();
                getStars(user_id);
            } catch (err) {
                console.error(`There b errors in ye star fetch... ${err}`)
            }
        } else { return }
    }

    const handleSort = (event) => {
        if (page === 'http://localhost:3000/') {
            if (event === 'Latest') {
                sortFeed(event, feed, 'home')
                setSortBy(event)
            } else {
                sortFeed(event.target.textContent, feed, 'home')
                setSortBy(event.target.textContent)
            }
        } else if (page === 'http://localhost:3000/collaborate') {
            if (event === 'Latest') {
                sortFeed(event, feed, 'collab')
                setSortBy(event)
            } else {
                sortFeed(event.target.textContent, feed, 'collab')
                setSortBy(event.target.textContent)
            }
        }
    }

    const cardColors = {
        song: 'songFeedCard',
        status: 'statusFeedCard',
        profile_pic: 'picFeedCard',
        music: 'musicFeedCard',
        lyrics: 'lyricFeedCard',
        default: 'gray'
    };
    const textColors = {
        song: 'blackSong',
        status: 'goldenrod',
        pic: 'black',
        default: 'antiquewhite'
    }

    return (
        <>
            <div className="outerFeedDiv">
                <div className="titleBox">
                    <h1>{sortBy} Posts:</h1>
                    <div className='sortSongs'>
                        <h3>Sort by: </h3>
                        <p className='sort' onClick={handleSort}>Latest</p>
                        <p className='sort' onClick={handleSort}>Oldest</p>
                        <p className='sort' onClick={handleSort}>Most Popular</p>
                    </div>
                </div>
                <div className='songBox'>
                    {feed.map((post, index) => {
                        const cardColor = cardColors[post.type] || cardColors['default']
                        const textColor = textColors[post.type] || textColors['default']
                        return (
                            <div className={`postCard ${cardColor}`} key={index}>
                                <div className="feedWrap">
                                <button className={post.user_id === user.user_id ? "delete" : "hide" }>Delete</button>
                                    <img className={index % 2 === 0 ? "thumbnail" : 'thumbnail2'} src={post.user_profile_pic} alt="userProfile"></img>
                                </div>
                                {post.type === 'music'
                                    && (<>
                                        <div className="musicFeedDiv">
                                            <h3 className="lyricTitleFeed">{post.title}</h3>
                                            <p className="lyricsFeed">by {post.username} needs lyrics...</p>
                                            <audio className={index % 2 === 0 ? "audio1" : "audio2"} controls src={post.song_file} type="audio/mp3"></audio>
                                        </div>
                                    </>)}

                                {post.type === "lyrics"
                                    && (<>
                                        <div className="lyricFeedDiv">
                                            <h3 className="lyricTitleFeed">{post.title}</h3>
                                            <p className="lyricsFeed">by {post.username} needs music...</p>
                                            <pre className="lyricsFeed">{post.lyrics.substring(0, 105)}...</pre>
                                        </div>
                                    </>)}

                                {post.type === "profile_pic"
                                    && (<>
                                        <div className="profilePicFeed" style={{ backgroundImage: `url(${post.feed_pic})` }}>
                                            <p className="postPicInfo">{post.username} updated their profile pic...</p>
                                        </div>
                                    </>)}

                                {post.type === "song"
                                    && (<>
                                        <div className="feedSongInfo">
                                            <div>
                                                <p className={`${textColor}`}>New song from</p><p className="songUserName">{` ${post.username}!`}</p>
                                            </div>
                                            <audio className={index % 2 === 0 ? "audio1" : "audio2"} controls src={post.song_file} type="audio/mp3"></audio>
                                            <h3 className={`${textColor}`}>"{post.title}"</h3>
                                        </div>
                                    </>)}

                                {post.type === "status"
                                    && (<>
                                        <div className="feedStatusContainer">
                                            <h2 className={`${textColor}`}>{`${post.username} says:`}</h2>
                                            <h3 className={`${textColor} feedStatus`}>{`"${post.user_status}"`}</h3>
                                        </div>
                                    </>)}

                                <div className="starsWrap">
                                    <div className="stars">
                                        <img src={(stars.includes(post.feed_id))
                                            ? starFilled
                                            : starHollow}
                                            alt="star"
                                            className="starImg"
                                            onClick={() => updateStars(user.user_id, post.feed_id)}></img>
                                        <p>Stars: </p>
                                        <p>{post.stars}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    )}

                </div>
            </div>
        </>
    )
}

export default Feed