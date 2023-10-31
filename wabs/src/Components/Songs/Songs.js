import react, { useState } from 'react'
import './Songs.css'

function Songs () {
    const [plays, setPlays] = useState(0)
    const [sortAudio, setSortAudio] = useState('Newest')
    const [songTitle, setSongTitle] = useState('WABS Theme Song')
    const [songwriter, setSongwriter] = useState('Tiny Sun')

const handleSort = (event) => {
    setSortAudio(event.target.textContent)
}

// Need to replace this return with a function that fills the return with a given selection of Songs, and alternates colors
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
                <div className='songCard'>
                    <img className="thumbnail" src="../../Assets/logo.png" alt="userProfile"></img>
                    <div className="songInfo">
                        <h2 className="info">{songwriter}</h2>
                        <p className="info">{songTitle}</p>
                        <p className="info">{plays}</p>
                    </div>
                    <audio controls src="../../Assets/themeSong.mp3" type="audio/mp3"></audio>
                </div>

                <div className='songCard'>
                    <img className="thumbnail2" src="../../Assets/logo.png" alt="userProfile"></img>
                    <div className="songInfo">
                        <h2 className="info">{songwriter}</h2>
                        <p className="info">{songTitle}</p>
                        <p className="info">{plays}</p>
                    </div>
                    <audio controls className="audio2" src="../../Assets/themeSong.mp3" type="audio/mp3"></audio>
                </div>

                <div className='songCard'>
                    <img className="thumbnail" src="../../Assets/logo.png" alt="userProfile"></img>
                    <div className="songInfo">
                        <h2 className="info">{songwriter}</h2>
                        <p className="info">{songTitle}</p>
                        <p className="info">{plays}</p>
                    </div>
                    <audio controls src="../../Assets/themeSong.mp3" type="audio/mp3"></audio>
                </div>

                <div className='songCard'>
                    <img className="thumbnail2" src="../../Assets/logo.png" alt="userProfile"></img>
                    <div className="songInfo">
                        <h2 className="info">{songwriter}</h2>
                        <p className="info">{songTitle}</p>
                        <p className="info">{plays}</p>
                    </div>
                    <audio controls className="audio2" src="../../Assets/themeSong.mp3" type="audio/mp3"></audio>
                </div>

            </div>

        </div>
    )
}

export default Songs