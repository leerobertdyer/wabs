import { useState, useEffect } from "react";
import { LiaTrashAlt } from "react-icons/lia";
import Audio from "../Audio/Audio";
import './Feed.css'

function Feed({ feed, user, loadFeed, sortFeed, showSort }) {
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

    const deletePost = async (feed_id, feed_type, user_id) => {
        console.log('Deleting Post ', feed_id)
        const resp = await fetch(`http://localhost:4000/delete-post?feed_id=${feed_id}&feed_type=${feed_type}&user_id=${user_id}`, {
            method: "DELETE",
            credentials: 'include'
        })
        const data = await resp.json();
        console.log(data.message);
        loadFeed();
    }

    const cardColors = {
        song: 'songFeedCard',
        status: 'statusFeedCard',
        profile_pic: 'picFeedCard',
        music: 'musicFeedCard',
        lyrics: 'lyricFeedCard',
        default: 'gray'
    };

    return (
        <>
            <div className="outerFeedDiv">
                {showSort &&
                    <div className="titleBox">
                        <h1 className="sortByTitle">{sortBy} Posts:</h1>
                        <div className='sortSongs'>
                            <h3>Sort by: </h3>
                            <p className='sort' onClick={handleSort}>Latest</p>
                            <p className='sort' onClick={handleSort}>Oldest</p>
                            <p className='sort' onClick={handleSort}>Most Popular</p>
                        </div>
                    </div>
                }

                <div className='allPosts'>
                    {feed.map((post, index) => {
                        const cardColor = cardColors[post.type] || cardColors['default']
                        return (
                            <div className={`postCard ${cardColor}`}
                                style={{ backgroundImage: `url(${post.feed_pic})`, backgroundSize: "cover", backgroundPositionY: "-100px" }} key={index}>

                                <div className="topPostDiv">
                                    <div className="thumbnailDiv">
                                        <img className="thumbnail" src={post.user_profile_pic} alt="userProfile"></img>
                                        <a href="#profile" className="usernameUnderImg">{post.username}</a>
                                    </div>
                                    {(post.type === "music" || post.type === "song" || post.type === "lyrics")
                                        && <h3 className="postTitle">"{post.title}"</h3>}
                                    {post.type === "status"
                                        && <h2 >{`${post.username} says:`}</h2>}
                                    <div className="starsWrap">
                                        <div className="starsPicAndDigit">
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
                                {(post.type === "song" || post.type === "music") && <> <Audio source={post.song_file} /> <div></div> </>}

                                {post.type === "lyrics"
                                    && <pre className="lyricsFeed">{post.lyrics.substring(0, 105)}...</pre>}

                                {post.type === "profile_pic" && <p className="postPicInfo">{post.username} updated their profile pic...</p>}

                                {post.type === "status" && <h3 className='feedStatus'>{`"${post.user_status}"`}</h3>}

                                {user.user_id === post.user_id && <LiaTrashAlt className="trash"
                                    onClick={() => deletePost(post.feed_id, post.type, user.user_id)} />}


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