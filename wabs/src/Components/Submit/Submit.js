import React, { useState } from 'react';
import './Submit.css'

function Submit(props) {
    const [title, setTitle] = useState('')
    const [lyrics, setLyrics] = useState('')
    const [song, setSong] = useState(null)

    const handleSongSubmit = async (event) => {
        event.preventDefault()
        const user = 13 //  props.user.user_id
        const formData = new FormData();
        
        try {
            const authUrlResponse = await fetch('http://localhost:4000/auth', {
                method: 'POST',
            })

            if (!authUrlResponse.ok) {
                throw new Error(`Failed to get auth URL: ${authUrlResponse.status}`);
            }

            const authData = await authUrlResponse.json();
            const authUrl = authData.authUrl
            console.log('authData', authData)
            console.log('authurl: ', authUrl)

            window.location.href = authUrl;
            console.log('here')
            // ** I'm thinking here, I can use this idea in a new component that deals with the final auth route.../access

        // const accessToken = await new Promise((resolve, reject) => {
        //     const timeout = 60000;
        //     const start = Date.now();
        //     const checkParams = async () => {
        //         const urlParams = new URLSearchParams(window.location.search);
        //         const token = urlParams.get('accessToken');
        //         if (token) {
        //             resolve(token);
        //         } else if (Date.now() - start < timeout) {
        //             setTimeout(checkParams, 500);
        //         } else {
        //             reject(new Error('Timeout: Access token not received.'));
        //         }
        //     };

        //     checkParams();
        // });
        // console.log(accessToken)
            if (song) {
                formData.append('title', title);
                formData.append('lyrics', lyrics)
                formData.append('user_id', user)
                formData.append('song_file', song);
                console.log(title, lyrics, user, song);

                console.log("in submit after songs: ", accessToken )
                const submitResponse = await fetch('http://localhost:4000/submit', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: formData,
                });

                if (submitResponse.ok) {
                    const submitData = await submitResponse.json();
                    console.log('Song submission successful:', submitData);
                } else {
                    const errorText = await submitResponse.text();
                    console.error('Failed to submit song. Server response:', submitResponse.status, errorText);
                }
            } else {
                console.log("Make sure there's a file..");
            }
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