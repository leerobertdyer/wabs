import React, { useState } from 'react';
import './Submit.css'

function Submit(props) {
    const [title, setTitle] = useState('')
    const [lyrics, setLyrics] = useState('')
    const [ song, setSong] = useState(null)
    // const [ isAuthorizing, setIsAuthorizing] = useState(false)

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
        console.log(updatedSong)
        try {
            await props.updateSong(updatedSong)
            const authUrlResponse = await fetch('http://localhost:4000/auth/dbx-auth', {
                method: 'POST',
            })
            if (!authUrlResponse.ok) {
                throw new Error(`Failed to get auth URL: ${authUrlResponse.status}`);
            }
            const authData = await authUrlResponse.json();
            const authUrl = authData.authUrl
            console.log('authData', authData)
            console.log('authurl: ', authUrl)
           
            window.open(authUrl, '_blank')
        } catch (error) {
            console.error('Error during song submission:', error);
        }
    };

    return (
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

}


export default Submit