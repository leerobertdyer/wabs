import { useState } from 'react'
import './Songs.css'

function Songs ({ songs }) {
    const [sortAudio, setSortAudio] = useState('Newest')

const handleSort = (event) => {
    setSortAudio(event.target.textContent)
}

    return (
        <div className='songPlayer'>
            <div className='titleBox'>
                <h1>{sortAudio} Songs:</h1> 
                <div className='sortSongs'>
                  <h3>Sort by: </h3>
                  <p className='sort' onClick={handleSort}>Newest </p>
                  <p className='sort' onClick={handleSort}>Oldest</p>
                  <p className='sort' onClick={handleSort}>Most Popular</p>
            </div>
            </div>
            <div className='songBox'>
                {songs.map((song, index) => (
                <div className='songCard' key={index}>
                    <div className='imgAndStars'>
                    <img className={index % 2 === 0 ? "thumbnail" : 'thumbnail2'} src={song.user_profile_pic} alt="userProfile"></img>
                    </div>
                    <div className="songInfo">
                        <h2 className="info">{song.username}</h2>
                        <p className="info">{song.title}</p>
                        <p className="info">{song.plays}</p>
                    </div>
                    <audio className={index % 2 === 0 ? "" : "audio2"} controls src={song.song_file} type="audio/mp3"></audio>
                </div>
                ))}

            </div>

        </div>
    )
}

export default Songs