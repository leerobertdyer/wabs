import React, { useState } from 'react';
import './Submit.css'

function Submit(props) {  
    const [title, setTitle] = useState('')
    const [lyrics, setLyrics] = useState('')
    const [song, setSong] = useState(null)

    const handleSongSubmit = (event) => {  // Current Issue: songwriter is not in users. Need to update id in users to user_id and same for other tables...
        event.preventDefault()
        const user = props.user.id
        console.log(user)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('lyrics', lyrics)
        formData.append('user_id', user)
        if (song) {
            formData.append('song_file', song)
            console.log(title, lyrics, user)
            console.log(formData);

            fetch('http://localhost:4000/submit', {
                method: 'post',
                body: formData
            }).then(resp => {
                if (resp.ok) {
                    return resp.json()
                } else { throw new Error(`Failed to Upload: ${resp.status}`) }
            }).then(data => {
                console.log(data)
            }).catch(error => {
                console.log("Something ain't right...", error.message)
            });
        } else { console.log("Make sure there's a file..") }
    }


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
                        onChange={(event) => { setLyrics(event.target.value) }}/>                    
                </div><div></div>
                <label htmlFor="songFile"
                    className='clickMe black smallFormButton center'>Song+</label>
                <input type="file"
                    id="songFile"
                    name="songFile"
                    accept="audio/*"
                    required
                    style={{ display: 'none' }}
                    onChange={(event) => {setSong(event.target.files[0])}} />
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