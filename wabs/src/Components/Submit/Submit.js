import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Submit.css'

function Submit(props) {
    const [title, setTitle] = useState('')
    const [lyrics, setLyrics] = useState('')
    const [song, setSong] = useState(null)
    const [showPopup, setShowPopup] = useState(true)
    const [showForm, setShowForm] = useState(false);
    const [showLyrics, setShowLyrics] = useState(false);
    const [showMusic, setShowMusic] = useState(false);

    const navigate = useNavigate();

    const handleSongSubmit = async (event) => {
        event.preventDefault()
        let resp
        if (showMusic && showLyrics) {
            const formData = new FormData()
            alert('Working on uploading song, hang tight...')
            if (song === null) {
                console.error('No song selected');
                return;
            }
            formData.append('title', title)
            formData.append('lyrics', lyrics)
            formData.append('song', song)
            formData.append('user_id', props.user.user_id)
            resp = await fetch('http://localhost:4000/submit-song', {
                method: "POST",
                body: formData,
                credentials: 'include'
            })
        } else if (showMusic && !showLyrics) {
            const formData2 = new FormData()
            alert('Working on uploading music, hang tight...')
            if (song === null) {
                console.error('No song selected');
                return;
            }
            formData2.append('title', title)
            formData2.append('song', song)
            formData2.append('user_id', props.user.user_id)
            resp = await fetch('http://localhost:4000/submit-music', {
                method: "POST",
                body: formData2,
                credentials: 'include'
            })
        } else if (!showMusic && showLyrics) {
            const data = {
                title: title,
                lyrics: lyrics,
                user_id: props.user.user_id
            }
            resp = await fetch('http://localhost:4000/submit-lyrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });
        }

        if (resp.ok) {
            navigate('/profile');
            props.loadSongs();
            props.loadFeed();
        } else { throw new Error(`Failed to upload yer damn song: ${resp.status}`); }
    }

    const showFormOnClick = (event) => {
        const id = event.target.id
        if (id === "fullSong") {
            setShowLyrics(true)
            setShowMusic(true)
        } else if (id === "justLyrics") {
            setShowLyrics(true)
        } else if (id === "justMusic") {
            setShowMusic(true)
        }
        setShowPopup(false)
        setShowForm(true)
    }

    const { isLoggedIn } = props.user;

    return (
        <div>
            {isLoggedIn ? (
                <div id="mainSubmitDiv"
                    className='black'>

                    {showPopup ? (
                        <>
                            <div className='firstPopup'>
                                <form className='firstPopup'>
                                    <h1>What are we submitting today?</h1>

                                    <label for="fullSong">A Full Song</label>
                                    <input type="radio"
                                        name='submitType'
                                        value="fullSong"
                                        id='fullSong'
                                        onClick={showFormOnClick}
                                    ></input>

                                    <label for="justLyrics">Just Lyrics</label>
                                    <input type="radio"
                                        name='submitType'
                                        value="justLyrics"
                                        id='justLyrics'
                                        onClick={showFormOnClick}
                                    ></input>

                                    <label for="justMusic">Just Music</label>
                                    <input type="radio"
                                        name='submitType'
                                        value="justMusic"
                                        id='justMusic'
                                        onClick={showFormOnClick}
                                    ></input>

                                </form>
                            </div>
                        </>)
                        : null}

                    {showForm ? (
                        <>
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
                                        onChange={(event) => { setTitle(event.target.value) }} />
                                </div>

                                {showLyrics ? (
                                    <div className='formBlock'>
                                        <label htmlFor="lyrics"
                                            className='clickMe black'>Lyrics</label>
                                        <textarea name="lyrics" id="lyrics"
                                            cols="50" rows="10"
                                            placeholder='I wrote me a song.... it had some words.... and now it exits...'
                                            required
                                            onChange={(event) => { setLyrics(event.target.value) }} />
                                    </div>
                                ) : null}

                                {showMusic ? (
                                    <>
                                        <label htmlFor="songFile"
                                            className='clickMe black smallFormButton center'>Song+</label>
                                        <input type="file"
                                            id="songFile"
                                            name="songFile"
                                            accept="audio/*"
                                            required
                                            style={{ display: 'none' }}
                                            onChange={(event) => { setSong(event.target.files[0]) }} />
                                    </>
                                ) : null}

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
                                    </div>))}
                            </div>
                        </>)
                        : null}
                </div>

            ) : <div>
                <div id="loginFromProfile">
                    <h2>Please </h2><Link to="/login">Log In</Link>
                </div>
            </div>}
        </div>
    )
}


export default Submit