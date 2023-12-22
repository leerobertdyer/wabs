import React, { useEffect, useState } from 'react';
import './Profile.css'
import { Link } from 'react-router-dom';
import Feed from '../../Components/Feed/Feed';
import { IoCameraSharp } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import FullSongFeed from '../../Components/FullSongFeed/FullSongFeed';




function Profile({ feed, user, loadCollabUsers, stars, getStars, updateStars, changeUserPic, changeUserCollab, loadFeed, sortFeed, changeUserStatus }) {
    const [showStatus, setShowStatus] = useState(false);
    const [checked, setChecked] = useState(user.collab === "true");
    const [showSongs, setShowSongs] = useState(false);
    const [userCollab, setUsercollab] = useState([]);
    const [showCollab, setShowCollab] = useState(false);
    const [showPosts, setShowPosts] = useState(false);
    const [showMessages, setShowMessages] = useState(false);
    

    useEffect(() => {
        getCollabStatus();
        getCurrentCollabList();
        // eslint-disable-next-line
    }, [])

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const getCollabStatus = async () => {
        const resp = await fetch(`${BACKEND_URL}/collab/collab-status`, { credentials: 'include' });
        const data = await resp.json();
        setChecked(data.collab);
    }

    const userSongs = [...feed]
        .filter((post) => post.user_id === user.user_id && post.type === "song")
        .sort((a, b) => new Date(b.song_date) - new Date(a.song_date));

    const userPosts = [...feed]
    .filter(post => post.user_id === user.user_id)

    const getCurrentCollabList = async() => {
        const resp = await fetch(`${BACKEND_URL}/collab/get-profile-collabs`, {credentials: 'include',});
        if (resp.ok) {
            const data = await resp.json();
            setUsercollab(data.userCollabs);
        } else {
            throw new Error(`Failed to get current user's collab list: ${resp.status}`);
        }
    }

    const handleSetProfilePhoto = (newPhoto) => changeUserPic(newPhoto);

    const handlePhotoSubmit = async (event) => {
        const ogPhoto = user.user_profile_pic;
        const photo = event.target.files[0];
        try {
            if (photo) {
                const temp = URL.createObjectURL(photo);
                handleSetProfilePhoto(temp);
                const formData = new FormData();
                formData.append('user_id', user.user_id);
                formData.append('photo', photo);
                const response = await fetch(`${BACKEND_URL}/profile/upload-profile-pic`, {
                    method: "PUT",
                    body: formData,
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    handleSetProfilePhoto(data.newPhoto);
                    loadFeed();
                    // console.log('photo saved in dbx: ', data.newPhoto);
                }
                else {
                    console.log(`Failed to upload your photo to dropbox: ${response.status}`);
                    handlePhotoSubmit(ogPhoto);
                }
            }
        } catch (error) {
            console.error('Error:', error.message);
        };
    }

    let changedStatus = ''

    const handleStatusChange = async (event) => {
        event.preventDefault();
        if (changedStatus.length > 0) {
            const response = await fetch(`${BACKEND_URL}/profile/update-status`, {
                headers: { 'content-type': 'application/json' },
                method: 'PUT',
                body: JSON.stringify({
                    id: user.user_id,
                    newStatus: changedStatus
                }),
                credentials: 'include'
            })
            if (response.ok) {
                const data = await response.json();
                changeUserStatus(data.status);
                loadFeed();
                setShowStatus(false);
            } else {
                throw new Error(`Failed to upload yer new statatus: ${response.status}`);
            }
        } else {
            setShowStatus(false);
            return null;
        }
    }

    const handleCollabSwitch = async () => {
        const resp = await fetch(`${BACKEND_URL}/collab/update-collab`, {
            headers: { 'content-type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify({
                id: user.user_id,
            }),
            credentials: 'include'
        })
        if (resp.ok) {
            const data = await resp.json();
            await changeUserCollab(data.nextCollab)
            setChecked(!checked)
            loadCollabUsers();
        }

    }

    const { isLoggedIn } = user;

    const handleProfileDisplay = (item) => {
        setShowCollab(false);
        setShowSongs(false);
        setShowStatus(false);
        setShowPosts(false);
        if (item === "songs") { setShowSongs(true) }
        if (item === "collabs") { setShowCollab(true) }
        if (item === "posts") { setShowPosts(true) }
        if (item === "messages") { setShowMessages(true) }
    }

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <div id="Profile">
                        <div id="topBar"
                            style={user.profileBackground
                                ? { backgroundImage: `url(${user.profileBackground}`, backgroundSize: 'cover' }
                                : { backgroundImage: "url('https://dl.dropboxusercontent.com/scl/fi/fyvbbqbf8grhralhhqtvn/pianoBackground.jpg?rlkey=0xy5uflju0yc61sueajzz5dw7&dl=0')", backgroundSize: '2100px', backgroundPositionY: '-2200px' }}>
                            <div id="picInputStatus">
                                <div className="picAndInput">
                                    <div className="profilePicContainer">
                                        <img src={user.user_profile_pic} alt="Profile" className='profilePic' />
                                    </div>
                                    <form encType="multipart/form-data">
                                        <label className="picInputLabel clickMe"
                                            htmlFor="filePicker"><IoCameraSharp />
                                        </label>
                                        <input
                                            type="file"
                                            id="filePicker"
                                            name="photo"
                                            accept="image/png, image/jpeg"
                                            style={{ display: 'none' }}
                                            onChange={handlePhotoSubmit}
                                        />
                                    </form></div>
                                <div className='underSwitchDiv'>
                                    <div className='switchDiv'>
                                        <label className="switch">

                                            <input type="checkbox" id="collabSwitch" checked={!!checked}
                                                onChange={() => { }}
                                                onClick={() => handleCollabSwitch()} />

                                            <span className="slider"></span>
                                        </label>
                                        {user.collab === "true"
                                            ? <p className='setUserCollab'>Collab On</p>
                                            : <p className='setUserCollab'>Collab Off</p>}
                                    </div>
                                    <div className='flexCol gap'>
                                        <p className='updateBackground padAndShade'
                                            onClick={() => setShowStatus(!showStatus)}>
                                            <CiEdit />Update Status</p>
                                        <p className='updateBackground padAndShade'><IoCameraSharp />Update Background</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='profileNav'>
                            <button className='btn' onClick={() => handleProfileDisplay('songs')}>Your Songs</button>
                            <button className='btn' onClick={() => handleProfileDisplay('collabs')}>Your Collabs</button>
                            <button className='btn' onClick={() => handleProfileDisplay('posts')}>Your posts</button>
                            <button className='btn' onClick={() => handleProfileDisplay('messages')}>Your messages</button>
                        </div>

                        {showStatus && <>
                            <div className='flexCol gap flexCtr padTen'>
                                <p>"{user.status}"</p>
                                <div className='flexRow gap'>
                                    <form>
                                        <input type='text' placeholder='new status...' onChange={(event) => changedStatus = event.target.value}></input>
                                        <input type="submit" className='btn' onClick={(event) => handleStatusChange(event)}></input>
                                    </form>
                                </div>
                            </div>

                        </>}

                        <div className='profileBottomDiv'>

                            {
                                showSongs && <>
                                    {userSongs.length === 0
                                        ? <>
                                            <div></div>
                                            <h2 className='noProfileSongs'>You have no songs! <Link className='profileLink' to="/submit">Submit one here</Link></h2>
                                            <div></div>
                                        </>
                                        : <>
                                            <div className='yourSongs'>
                                                <h3 className='profileFeedTitles'>Your Songs:</h3>
                                                <Feed user={user} stars={stars} getStars={getStars} updateStars={updateStars} showSort={false} feed={userSongs} loadFeed={loadFeed} sortFeed={sortFeed} />
                                            </div>
                                        </>}
                               </>
                            }
                            {
                                showPosts && userPosts.length > 0 && <>
                             <Feed user={user} stars={stars} getStars={getStars} updateStars={updateStars} showSort={false} feed={userPosts} loadFeed={loadFeed} sortFeed={sortFeed} />
                                </>
                            }
                        </div>
                    </div>
                </div>)
                : <div>
                    <div id="loginFromProfile">
                        <h2>Please </h2><Link to="/login">Log In</Link>
                    </div>
                </div>}
        </div>
    )
}

export default Profile