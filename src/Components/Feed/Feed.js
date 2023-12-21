import { useState, useEffect } from "react";
import { LiaTrashAlt } from "react-icons/lia";
import Audio from "../Audio/Audio";
import './Feed.css'
import { Link, useNavigate } from "react-router-dom";

function Feed({ feed, collabFeed, user, loadFeed, sortFeed, showSort, getStars, updateStars, stars}) {
    const [sortBy, setSortBy] = useState('Latest')
    const page = window.location.href
    const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
    const navigate = useNavigate();
    
    useEffect(() => {
        setSortBy('Latest')
        handleSort('Latest')
        // eslint-disable-next-line
    }, [page])

    useEffect(() => {
        if (user.user_id) {
            getStars(user.user_id);
        }
        // eslint-disable-next-line
    }, [user])

    useEffect(() => {
        if (page === `${FRONTEND_URL}/`){
            sortFeed(sortBy, feed, 'home')
        } else if (page === `${FRONTEND_URL}/collaborate`){
             sortFeed(sortBy, collabFeed, 'collab')
        }
        // eslint-disable-next-line
      }, [stars])

    const starHollow = '../../../Assets/star.png'
    const starFilled = '../../../Assets/starFilled.png'

    const handleSort = (event) => {
        if (page === `${FRONTEND_URL}/`) {
            if (event === 'Latest') {
                sortFeed(event, feed, 'home')
                setSortBy(event)
            } else {
                sortFeed(event.target.textContent, feed, 'home')
                setSortBy(event.target.textContent)
            }
        } else if (page === `${FRONTEND_URL}/collaborate`) {
            if (event === 'Latest') {
                sortFeed(event, feed, 'collab')
                setSortBy(event)
            } else {
                sortFeed(event.target.textContent, feed, 'collab')
                setSortBy(event.target.textContent)
            }
        }
    }

    const handleStarClick = async(post_id) => {
        page === `${FRONTEND_URL}/`
        ? await updateStars(user.user_id, post_id, sortBy, 'home')
        : await updateStars(user.user_id, post_id, sortBy, 'collab')
    }

    const deletePost = async (feed_id, feed_type, user_id) => {
        console.log('Deleting Post ', feed_id)
        const resp = await fetch(`${BACKEND_URL}/delete-post?feed_id=${feed_id}&feed_type=${feed_type}&user_id=${user_id}`, {
            method: "DELETE",
            credentials: 'include'
        })
        const data = await resp.json();
        console.log(data.message);
        loadFeed();
    }

    const handleCollabClick = (post) => {
                navigate(`/collaborate/editor`, {state: { post }})
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
                {showSort &&<>
                    <div className="titleBox">
                        <div className='sortSongs'>
                            <h3 className="sortBy">Sort by: </h3>
                            <p className='sort' onClick={handleSort}>Most Popular</p>
                            <p className='sort' onClick={handleSort}>Oldest</p>
                            <p className='sort' onClick={handleSort}>Latest</p>
                        </div>
                    </div>
                        <h1 className="sortByTitle">{sortBy} Posts:</h1>
                        </> 
                }

                <div className='allPosts'>
                    {feed.map((post, index) => {
                        const cardColor = cardColors[post.type] || cardColors['default']
                        return (
                            <div className={`postCard ${cardColor}`}
                            style={post.type === "profile_pic"
                            ? {
                                backgroundImage: `url(${post.feed_pic})`,
                                backgroundSize: "cover",
                                backgroundPositionY: "-100px",
                              }
                            : {}}
                                key={index}>

                                <div className="topPostDiv">
                                    <Link to="/profile" className="thumbnailDiv" style={{backgroundImage: `url(${post.user_profile_pic})`, backgroundSize: 'cover' }}>
                                    </Link>
                                    <Link to="/profile" className="hiddenUser">{post.username}</Link> 
                                    {(post.type === "music" || post.type === "lyrics")
                                        && <h3 className="postTitle">"{post.title}"</h3>}
                                    {post.type === "song" && <h3 className="postTitle"><span className="newSongPreTitle">New Song:</span>{post.title}</h3>}
                                    {post.type === "status"
                                        && <h2 >{`${post.username} says:`}</h2>}
                                    <div className="starsWrap">
                                        <div className="starsPicAndDigit">
                                            <img src={(stars.includes(post.feed_id))
                                                ? starFilled
                                                : starHollow}
                                                alt="star"
                                                className="starImg"
                                                onClick={() => handleStarClick(post.feed_id)}></img>
                                            <p>Stars: {post.stars}</p>
                                        </div>
                                    </div>


                                </div>
                                {(post.type === "song" || post.type === "music") && <> <Audio className="feedAudio" source={post.song_file} /> <div></div> </>}

                                {post.type === "lyrics"
                                    && <pre className="lyricsFeed">{post.lyrics.substring(0, 105)}...</pre>}

                                {post.type === "profile_pic" && <p className="postPicInfo">{post.username} updated their profile pic...</p>}
                                
                                {post.type === "status" && <h3 className='feedStatus'>{`"${post.feed_status}"`}</h3>}
                                {(post.type === "music" || post.type === "lyrics") && post.user_id !== user.user_id
                                && <button className="collabButton" onClick={() => (handleCollabClick(post))}>Collaborate!</button>
                            }
                                {user.user_id === post.user_id && <div className="trash">
                                    <LiaTrashAlt size={40}
                                    onClick={() => deletePost(post.feed_id, post.type, user.user_id)} />
                                    </div>}
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