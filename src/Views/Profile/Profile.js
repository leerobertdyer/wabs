import React, { useEffect, useState } from 'react';
import './Profile.css'
import { Link } from 'react-router-dom';
import Feed from '../../Components/Feed/Feed';
import { IoCameraSharp } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import FullSongFeed from '../../Components/FullSongFeed/FullSongFeed';
import { auth } from '../../firebase';
import Conversation from '../../Components/Conversation/Conversation';



function Profile({ feed, user, allMessages, conversations, token, socket, allUsers, loadAllUsers, stars, getStars, updateStars, changeUserProfile, changeUserPic, changeUserCollab, loadFeed, sortFeed, changeUserStatus }) {
    const [showStatus, setShowStatus] = useState(false);
    const [checked, setChecked] = useState(user.collab === 'true');
    const [showSongs, setShowSongs] = useState(false);
    const [userCollab, setUsercollab] = useState([]);
    const [showCollab, setShowCollab] = useState(false);
    const [showPosts, setShowPosts] = useState(false);
    const [userDataIsLoaded, setUserDataIsLoaded] = useState(false)
    const [showMessages, setShowMessages] = useState(false);
    const [showNewConvo, setShowNewConvo] = useState(false);

    useEffect(() => {
        const timer = async () => {
            setTimeout(() => {
                setUserDataIsLoaded(true)
            }, 350)
        }

        if (token) {
            const fetchData = async () => {
                await getCollabStatus();
                await getCurrentCollabList();
                setUserDataIsLoaded(true)
            }
            fetchData();
        } else { timer(); }
        // eslint-disable-next-line
    }, [token])


    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const allOtherUsers = allUsers.filter(other => other.user_id !== user.user_id)

    const getCollabStatus = async () => {
        const resp = await fetch(`${BACKEND_URL}/collab/collab-status`, {
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`,
            },
        });
        const data = await resp.json();
        setChecked(data.collab === 'true');
    }

    const userSongs = [...feed]
        .filter((post) => post.user_id === user.user_id && (post.type === "song" || post.type === "collab"))
        .sort((a, b) => new Date(b.song_date) - new Date(a.song_date));

    const userPosts = [...feed]
        .filter(post => post.user_id === user.user_id)

    const getCurrentCollabList = async () => {
        try {
            const resp = await fetch(`${BACKEND_URL}/collab/get-profile-collabs`, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (resp.ok) {
                const data = await resp.json();
                const sortedFeed = data.userCollabs.sort((a, b) => b.collab_id - a.collab_id)
                setUsercollab(sortedFeed);
            } else {
                throw new Error(`Failed to get current user's collab list: ${resp.status}`);
            }
        } catch (err) {
            console.error(`Failing to fetch getCurrentCollab from profile: ${err}`)
        }
    }

    const handleSetProfilePhoto = (newPhoto) => changeUserPic(newPhoto);
    const handleSetBackgroundPhoto = (newPhoto) => changeUserProfile(newPhoto);

    const handlePhotoSubmit = async (event, type) => {
        const ogPhoto = user.user_profile_pic;
        const photo = event.target.files[0];
        try {
            if (photo) {
                const temp = URL.createObjectURL(photo);
                type === "profile_pic"
                    ? handleSetProfilePhoto(temp)
                    : handleSetBackgroundPhoto(temp)

                const formData = new FormData();
                formData.append('user_id', user.user_id);
                formData.append('photo', photo);
                let resp;
                console.log('userId, photo: ', user.user_id, photo);
                if (type === "profile_pic") {
                    resp = await fetch(`${BACKEND_URL}/profile/upload-profile-pic`, {
                        method: "PUT",
                        body: formData,
                    });
                } else {
                    resp = await fetch(`${BACKEND_URL}/profile/upload-background-pic`, {
                        method: "PUT",
                        body: formData,
                    });
                }
                if (resp.ok) {
                    const data = await resp.json();
                    type === "profile_pic"
                        ? handleSetProfilePhoto(data.newPhoto)
                        : handleSetBackgroundPhoto(data.newPhoto)
                    // console.log('photo saved in dbx: ', data.newPhoto);
                }
                else {
                    console.log(`Failed to upload your photo to dropbox: ${resp.status}`);
                    type === "profile_pic"
                        ? handlePhotoSubmit(ogPhoto, 'profile_pic')
                        : handlePhotoSubmit(ogPhoto, 'profile_background')
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
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                method: 'PUT',
                body: JSON.stringify({
                    id: user.user_id,
                    newStatus: changedStatus
                })
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
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                id: user.user_id,
            })
        })
        if (resp.ok) {
            const data = await resp.json();
            await changeUserCollab(data.nextCollab)
            setChecked(!checked)
            loadAllUsers();
        }

    }

    const handleProfileDisplay = (item) => {
        setShowCollab(false);
        setShowSongs(false);
        setShowStatus(false);
        setShowPosts(false);
        setShowMessages(false);
        if (item === "songs") { setShowSongs(true) }
        if (item === "collabs") { setShowCollab(true) }
        if (item === "posts") { setShowPosts(true) }
        if (item === "messages") { setShowMessages(true) }
    }

    const handleNewConvo = () => {
        setShowNewConvo(true)
    }

    const createConversation = async (user2) => {
        console.log(user2.username)
        const resp = await fetch(`${BACKEND_URL}/messages/new-conversation`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                user1username: user.username,
                user2username: user2.username,
                user1_id: user.user_id,
                user2_id: user2.user_id
            })
        });
        if (resp.ok) {
            const data = await resp.json();
            console.log('new convo: ', data.conversations);
            socket.emit('getConversations')
            setShowNewConvo(false);
        }
    }

    const { isLoggedIn } = user

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <div id="Profile">
                        <div id="topBar"
                            style={{ backgroundImage: `url(${user.profile_background}`, backgroundSize: 'cover' }}>
                            <div id="picInputStatus">
                                <div className="picAndInput">
                                    <div className="profilePicContainer">
                                        <label className="picInputLabel clickMe"
                                            htmlFor="filePicker">
                                            <div className='profilePic' style={{ backgroundImage: `url(${user.user_profile_pic})`, backgroundSize: 'cover' }}>
                                            </div>
                                        </label>
                                    </div>
                                    <form encType="multipart/form-data">
                                        <input
                                            type="file"
                                            id="filePicker"
                                            name="photo"
                                            accept="image/png, image/jpeg"
                                            style={{ display: 'none' }}
                                            onChange={(event) => handlePhotoSubmit(event, 'profile_pic')}
                                        />
                                        <input
                                            type="file"
                                            id="backgroundImagePicker"
                                            name="photo"
                                            accept="image/png, image/jpeg"
                                            style={{ display: 'none' }}
                                            onChange={(event) => handlePhotoSubmit(event, 'profile_background')}
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
                                        <label htmlFor="backgroundImagePicker">
                                            <p className='updateBackground padAndShade'><IoCameraSharp />Update Background</p>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='profileNav'>
                            <button className='btn' onClick={() => handleProfileDisplay('songs')}>Your Songs</button>
                            <button className='btn' onClick={() => handleProfileDisplay('collabs')}>Your Collabs</button>
                            <button className='btn' onClick={() => handleProfileDisplay('posts')}>Your Posts</button>
                            <button className='btn' onClick={() => handleProfileDisplay('messages')}>Messages (fix)</button>
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
                                            <div className='yourDivs'>
                                                <h3 className='profileFeedTitles'>Your Songs:</h3>
                                                <Feed user={user} stars={stars} getStars={getStars} updateStars={updateStars} showSort={false} feed={userSongs} loadFeed={loadFeed} sortFeed={sortFeed} />
                                            </div>
                                        </>}
                                </>
                            }

                            {
                                showCollab && <div className='allUserCollabs'>
                                    {userCollab.length > 0
                                        ? <div className='yourDivs'>
                                            <h3 className='profileFeedTitles'>Your Collabs:</h3>
                                            <FullSongFeed feed={userCollab} user={user} />
                                        </div>
                                        : <>
                                            <div></div>
                                            <h2 className='noProfileSongs'>You have no Collabs! <Link className='profileLink' to="/collaborate">Check out Collab Page!</Link></h2>
                                            <div></div>
                                        </>
                                    }
                                </div>
                            }

                            {
                                showPosts && userPosts.length > 0 && <div className='yourDivs'>
                                    <h3 className='profileFeedTitles'>Your Posts:</h3>
                                    <Feed user={user} stars={stars} getStars={getStars} updateStars={updateStars} showSort={false} feed={userPosts} loadFeed={loadFeed} sortFeed={sortFeed} />
                                </div>
                            }

                            {
                                showMessages && <>
                                    {showNewConvo && <>
                                        <p>Who would you like to chat with?</p>
                                        {allOtherUsers.map((user, idx) => {
                                            return <p key={idx} className='userChatLink' onClick={() => createConversation(user)}>{user.username}</p>
                                        })}
                                    </>}
                                    <button className='btn newConvoBtn' onClick={handleNewConvo}>+new convo</button>

                                    {conversations &&
                                        conversations.map((convo, idx) => {
                                            const filteredMessages = allMessages.filter(mess => mess.conversation_id === convo.conversation_id)
                                            return <Conversation key={idx} socket={socket} user={user} user1username = {convo.user1username} user2username={convo.user2username} user2_id={convo.user2_id} conversation_id={convo.conversation_id} allMessages={filteredMessages} />
                                        })}

                                </>
                            }

                        </div>
                    </div>
                </div>)

                : auth.currentUser === null && userDataIsLoaded &&
                <div>
                    <div id="loginFromProfile">
                        <h2>Please </h2><Link to="/login">Log In</Link>
                    </div>
                </div>}
        </div>
    )
}

export default Profile