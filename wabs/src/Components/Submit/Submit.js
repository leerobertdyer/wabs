import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Submit.css'

function Submit(props) {
    const [title, setTitle] = useState('')
    const [lyrics, setLyrics] = useState('')
    const [ song, setSong] = useState(null)

    const handleSongSubmit = async (event) => {
        event.preventDefault()
        if (song === null) {
            console.error('No song selected');
            return;
        }  
        const updatedSong = {
            title: title,
            lyrics: lyrics,
            song: song
        }
        const temp = URL.createObjectURL(song)
        // console.log('Uploaded Song: ', updatedSong)
        // console.log('user id: ', props.user.user_id)
        
        const formData = new FormData()
        formData.append('title', updatedSong.title)
        formData.append('lyrics', updatedSong.lyrics)
        formData.append('song', updatedSong.song)
        formData.append('user_id', props.user.user_id)

        fetch('http://localhost:4000/submit', {
            method: "POST",
            body: formData,
            credentials: 'include'
        }).then(resp => {
            if (resp.ok){
                return resp.json()
            } 
            else {
                throw new Error(`Failed to upload yer damn song: ${resp.status}`);
            }
        }).then(songData => {
            console.log('final response from submit: ', songData)
        })
    };

    const { isLoggedIn } = props.user;

    return (
        <div>
            {isLoggedIn ?(

        <div id="mainSubmitDiv"
        className='black'>
            <form className='submitSongForm'
                action="/submit"
                method="post"
                encType="multipart/form-data">
                <legend className='submitSongLegend'>Submit A Song!</legend>
                <div className='formBlock'>
                    <label htmlFor="songTitle"
                        className='clickMe black submitLabel'>Title</label>
                    <input type="text"
                        className='submitSongInputs'
                        id="songTitle"
                        name="Title"
                        required
                        placeholder='Song Title'
                        onChange={(event) => { setTitle(event.target.value) }}
                        />
                </div><div></div>
                <div className='formBlock'>
                    <label htmlFor="lyrics"
                        className='clickMe black'>Lyrics</label>
                    <textarea name="lyrics" id="lyrics"
                        cols="30" rows="10"
                        placeholder='I wrote me a song.... it had some words.... and now it exits...'
                        required
                        onChange={(event) => { setLyrics(event.target.value) }} />
                </div><div></div>
                <label htmlFor="songFile"
                    className='clickMe black smallFormButton center'>Song+</label>
                <input type="file"
                    id="songFile"
                    name="songFile"
                    accept="audio/*"
                    required
                    style={{ display: 'none' }}
                    onChange={(event) => { setSong(event.target.files[0]) }} />
                <input type="submit"
                    value="Submit"
                    className='formSubmitButton'
                    onClick={handleSongSubmit} />
            </form>
            <div className='underSongSubmit'>
                <h2 className='scrollingText golden'>{title}</h2>

                {lyrics.split('\n').map((line, index) => (
                    <div key={index} className="scrollingText">
                        {line}
                    </div>
                ))}

            </div>
        </div>
            )
            : <div>
                <div id="loginFromProfile">
                    <h2>Please </h2><Link to="/login">Log In</Link>
                </div>
            </div>}
    </div>
)
}


export default Submit