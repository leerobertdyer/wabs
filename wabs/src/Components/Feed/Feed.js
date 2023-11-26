import { useState, useEffect } from "react";
import './Feed.css'

function Feed({ feed }) {
    const [sortBy, setSortBy] = useState('Latest')

    let starImage = '../../../Assets/star.png'
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
                            <img src={'../../../Assets/star.png'} 
                            alt="star" 
                            className="starImg"></img>
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