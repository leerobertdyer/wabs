import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import './Submit.css'

function Submit(props) {
    const [title, setTitle] = useState('')
    const [lyrics, setLyrics] = useState('')
    const [song, setSong] = useState(null)
    const [showPopup, setShowPopup] = useState(true)
    const [showForm, setShowForm] = useState(false);
    const [showLyrics, setShowLyrics] = useState(false);
    const [showMusic, setShowMusic] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userDataIsLoaded, setUserDataIsLoaded] = useState(false)

    useEffect(() => {
       const timer = async() => {
           setTimeout(() => {
            setUserDataIsLoaded(true)
           }, 400)
       }
       timer();
    }, [])

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
    const navigate = useNavigate();

    const handleSongSubmit = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        let resp
        if (showMusic && showLyrics) {
            const formData = new FormData()
            if (song === null) {
                console.error('No song selected');
                return;
            }
            formData.append('title', title)
            formData.append('lyrics', lyrics)
            formData.append('song', song)
            formData.append('user_id', props.user.user_id)
            resp = await fetch(`${BACKEND_URL}/submit-song`, {
                method: "POST",
                body: formData,
                credentials: 'include'
            })
        } else if (showMusic && !showLyrics) {
            const formData2 = new FormData()
            if (song === null) {
                console.error('No song selected');
                return;
            }
            formData2.append('title', title)
            formData2.append('song', song)
            formData2.append('user_id', props.user.user_id)
            resp = await fetch(`${BACKEND_URL}/submit-music`, {
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
            resp = await fetch(`${BACKEND_URL}/submit-lyrics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });
        }

        if (resp.ok) {
            setIsLoading(false)
            navigate('/feed');
            props.loadFeed();
            props.loadAllUsers();
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
            {isLoading &&  
            <>
            <div className='loading'>
                <ReactLoading type={'spinningBubbles'} color={'orange'} height={'30%'} width={'30%'} />
                <p className='loadingToDbx'>Uploading To Dropbox...</p>
                <p className='savingToDb'>Saving To Database...</p>
                </div>
            </>
                }
            {isLoggedIn && userDataIsLoaded ? (
                <div id="mainSubmitDiv"
                    className='black'>

                    {showPopup && (
                        <>
                            <form className='firstPopup'>
                                <h1 className='popupTitle'>What are we submitting today?</h1>

                                <label htmlFor="fullSong" className='radioLabel'>A Full Song</label>
                                <input type="radio"
                                    className='radioBtn'
                                    name='submitType'
                                    value="fullSong"
                                    id='fullSong'
                                    onClick={showFormOnClick}
                                ></input>

                                <label htmlFor="justLyrics" className='radioLabel'>Just Lyrics</label>
                                <input type="radio"
                                    className='radioBtn'
                                    name='submitType'
                                    value="justLyrics"
                                    id='justLyrics'
                                    onClick={showFormOnClick}
                                ></input>

                                <label htmlFor="justMusic" className='radioLabel'>Just Music</label>
                                <input type="radio"
                                    className='radioBtn'
                                    name='submitType'
                                    value="justMusic"
                                    id='justMusic'
                                    onClick={showFormOnClick}
                                ></input>
                            </form>
                        </>)}

                    {showForm && (
                        <>
                            <form className='submitSongForm'
                                action="/submit"
                                method="post"
                                encType="multipart/form-data">

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

                                {showLyrics && (
                                    <><div className='formBlock'>
                                        <textarea className="lyricsTextArea paper" placeholder="lyrics..."onChange={(event) => setLyrics(event.target.value)} />
                                        </div>
                                    </>
                                )}

                                {showMusic && (
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
                                )}

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
                        </>)}
                </div>

            ) : userDataIsLoaded && <div>
                <div id="loginFromProfile">
                    <h2>Please </h2><Link to="/login">Log In</Link>
                </div>
            </div>}
        </div>
    )
}


export default Submit