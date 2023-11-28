import { useState, useEffect } from "react";
import './Feed.css'

function Feed({ feed, user }) {
    const [sortBy, setSortBy] = useState('Latest')
    const [stars, setStars] = useState([])

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
            getStars(user_id);
        } catch (err) {
            console.error(`There b errors in ye star fetch... ${err}`)
        }
    }

    const handleSort = (event) => {
        setSortBy(event.target.textContent)
    }
    return (
        <>
            <div className="outerFeedDiv">
                <div className="titleBox">
                    <h1>{sortBy} Posts:</h1>
                    <div className='sortSongs'>
                        <h3>Sort by: </h3>
                        <p className='sort' onClick={handleSort}>Latest </p>
                        <p className='sort' onClick={handleSort}>Oldest</p>
                        <p className='sort' onClick={handleSort}>Most Popular</p>
                    </div>
                </div>
                <div className='songBox'>
                    {feed.map((post, index) => (
                        <div className='songCard' key={index}>
                            <div className="imgAndStars">
                                <img className={index % 2 === 0 ? "thumbnail" : 'thumbnail2'} src={post.user_profile_pic} alt="userProfile"></img>
                                <div className="stars">
                                    <p>Stars: </p>
                                    <img src={(stars.includes(post.feed_id))
                                        ? starFilled
                                        : starHollow}
                                        alt="star"
                                        className="starImg"
                                        onClick={() => updateStars(user.user_id, post.feed_id)}></img>
                                    <p>{post.stars || 0}</p>
                                </div>
                            </div>
                            {post.type === "profile_pic"
                                ? (<>
                                    <p className="info">{post.username} updated their profile pic...</p>
                                    <div></div>
                                </>)
                                : null}

                            {post.song_file
                                ? (<>
                                    <div className="songInfo">
                                        <h2 className="info">{post.username}</h2>
                                        <p className="info">{post.title}</p>
                                        <p className="info">New Song!</p>
                                    </div>
                                    <audio className={index % 2 === 0 ? "" : "audio2"} controls src={post.song_file} type="audio/mp3"></audio>
                                </>)
                                : null}
                        </div>
                    ))}

                </div>
            </div>
        </>
    )
}

export default Feed