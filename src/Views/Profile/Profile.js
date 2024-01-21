import React, { useEffect, useState } from 'react';
import './Profile.css'
import { Link } from 'react-router-dom';
import Feed from '../../Components/Feed/Feed';
import { IoCameraSharp } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import FullSongFeed from '../../Components/FullSongFeed/FullSongFeed';
import { auth } from '../../firebase';
import Conversation from '../../Components/Conversation/Conversation';
import Notifications from '../../Components/Notifications/Notifications';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function Profile({ feed, user, allMessages, onlineUsers, conversations, messageNotes, collabNotes, handleSetNotes, token, socket, allUsers, loadAllUsers, stars, getStars, updateStars, changeUserProfile, changeUserPic, changeUserCollab, loadFeed, sortFeed, changeUserStatus }) {
    const [showStatus, setShowStatus] = useState(false);
    const [showSongs, setShowSongs] = useState(false);
    const [userCollab, setUsercollab] = useState([]);
    const [showCollab, setShowCollab] = useState(false);
    const [showPosts, setShowPosts] = useState(false);
    const [userDataIsLoaded, setUserDataIsLoaded] = useState(false)
    const [showMessages, setShowMessages] = useState(false);
    const [showNewConvo, setShowNewConvo] = useState(false);
    const [profileUser, setProfileUser] = useState(user);
    const [showPromptsFull, setShowPromptsFull] = useState(false)
    const [showPrompts, setShowPrompts] = useState(false);
    const [prompts, setPrompts] = useState([])
    const [showPromptCheck, setShowPromptCheck] = useState(false);
    const [songTitle, setSongTitle] = useState('');
    const [songLyrics, setSongLyrics] = useState('');
    const [promptToCheck, setPromptToCheck] = useState('')
    // const [checked, setChecked] = useState(user.collab === 'true');

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const allOtherUsers = allUsers.filter(other => other.user_id !== user.user_id).sort((a, b) => {
        const aIsOnline = onlineUsers && onlineUsers.includes(a.username);
        const bIsOnline = onlineUsers && onlineUsers.includes(b.username);
        return bIsOnline - aIsOnline;
    })

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const otherUsername = queryParams.get("otherusername");
    // otherUsername && console.log(otherUsername);


    useEffect(() => {
        if (otherUsername) {
            return
        }
        setProfileUser(user)
    }, [user, otherUsername])


    useEffect(() => {
        if (otherUsername) {
            const getOtherUser = async () => {
                const resp = await fetch(`${BACKEND_URL}/profile/get-other-user?username=${otherUsername}`);
                if (resp.ok) {
                    const data = await resp.json();
                    // console.log(data);
                    setProfileUser(data.newUser);
                }
            }
            getOtherUser();
        }
        // eslint-disable-next-line
    }, [BACKEND_URL, otherUsername])

    useEffect(() => {
        const fetchData = async () => {
            // await getCollabStatus();
            await getCurrentCollabList();
            setUserDataIsLoaded(true)
        }
        fetchData();
        //eslint-disable-next-line
    }, [profileUser])

    useEffect(() => {
        const fetchPrompts = async () => {
            const resp = await fetch(`${BACKEND_URL}/user-prompts`,
                {
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                })
            const data = await resp.json()
            const userPrompts = data.prompts.map(prompt => prompt.prompt)
            setPrompts(userPrompts)
            if (userPrompts.length > 1) {
                setShowPromptsFull(true)
            }
        }
        if (user.isLoggedIn) {
            fetchPrompts()
        }
    }, [user, token, BACKEND_URL])

    // const handleCollabSwitch = async () => {
    //     const resp = await fetch(`${BACKEND_URL}/collab/update-collab`, {
    //         method: 'PUT',
    //         headers: { 'content-type': 'application/json' },
    //         body: JSON.stringify({
    //             id: user.user_id,
    //         })
    //     })
    //     if (resp.ok) {
    //         const data = await resp.json();
    //         await changeUserCollab(data.nextCollab)
    //         setChecked(!checked)
    //         loadAllUsers();
    //     }

    // }

    // const getCollabStatus = async () => {
    //     const resp = await fetch(`${BACKEND_URL}/collab/collab-status`, {
    //         headers: {
    //             'content-type': 'application/json',
    //             'authorization': `Bearer ${token}`,
    //         },
    //     });
    //     const data = await resp.json();
    //     setChecked(data.collab === 'true');
    // }



    const userSongs = [...feed]
        .filter((post) => post.user_id === profileUser.user_id && (post.type === "song" || post.type === "collab"))
        .sort((a, b) => new Date(b.song_date) - new Date(a.song_date));

    const userPosts = [...feed]
        .filter(post => post.user_id === profileUser.user_id)

    const getCurrentCollabList = async () => {
        try {
            const resp = await fetch(`${BACKEND_URL}/collab/get-profile-collabs?user=${profileUser.user_id}`, {
                headers: { 'content-type': 'application/json' }
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
                // console.log('userId, photo: ', user.user_id, photo);
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

    const handleProfileDisplay = async (type) => {
        setShowCollab(false);
        setShowSongs(false);
        setShowStatus(false);
        setShowPosts(false);
        setShowMessages(false);
        setShowPrompts(false)
        if (type === "songs") { setShowSongs(true) }
        if (type === "posts") { setShowPosts(true) }
        if (type === "collab") {
            setShowCollab(true)
            if (user.user_id !== profileUser.user_id) {
                return;
            }
            const resp = await fetch(`${BACKEND_URL}/profile/clear-notification`, {
                method: "DELETE",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    type: type,
                    user_id: user.user_id
                })
            });
            if (resp.ok) {
                const data = await resp.json();
                handleSetNotes(data.newNotes);
            }
        }
        if (type === "message") {
            setShowMessages(true)
            const resp = await fetch(`${BACKEND_URL}/profile/clear-notification`, {
                method: "DELETE",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    type: type,
                    user_id: user.user_id
                })
            });
            if (resp.ok) {
                const data = await resp.json();
                // console.log('resp ok: ', data.newNotes);
                handleSetNotes(data.newNotes, 'message')
            }
        }
    }

    const handleNewConvo = () => {
        setShowNewConvo(true)
    }

    const createConversation = async (user2) => {

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
            setShowNewConvo(false);
        }
    }

    const getPrompts = async () => {
        try {
            const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/get-prompt`, { userId: user.user_id })
            if (resp.data.message) {
                setShowPromptsFull(true)
            } else {
                console.log(resp.data.gptResponse)
            }
        } catch (error) {
            console.error(`error getting prompt: ${error}`)
        }
    }

    const handlePromptClick = (prompt) => {
        setPromptToCheck(prompt)
        setShowPromptCheck(true)
    }

    const handlePromptSubmit = async (event, songTitle, songLyrics, prompt) => {
        event.preventDefault()
        console.log(songTitle, songLyrics, prompt);
        const resp = await fetch(`${BACKEND_URL}/check-prompt`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                songTitle: songTitle,
                songLyrics: songLyrics,
                prompt: prompt,
                userId: user.user_id
            })
        });
        if (resp.ok) {
            const data = await resp.json();
            console.log(data);
        }
    }

    const { isLoggedIn } = user

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <div id="Profile">
                        <div id="topBar"
                            style={{ backgroundImage: `url(${profileUser.profile_background}`, backgroundSize: 'cover' }}>
                            <div id="picInputStatus">
                                <div className="picAndInput">
                                    <div className="profilePicContainer">
                                        <label className="picInputLabel clickMe"
                                            htmlFor={user.user_id !== profileUser.user_id ? null : "filePicker"}>
                                            <div className='profilePic' style={{ backgroundImage: `url(${profileUser.user_profile_pic})`, backgroundSize: 'cover' }}>
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
                                {/* <div className='underSwitchDiv'>
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
                                    </div> */}
                                {user.user_id === profileUser.user_id
                                    && <div className='flexCol gap statusAndPicDiv'>
                                        <p className='updateBackground padAndShade'
                                            onClick={() => setShowStatus(!showStatus)}>
                                            <CiEdit />Update Status</p>
                                        <label htmlFor="backgroundImagePicker">
                                            <p className='updateBackground padAndShade'><IoCameraSharp />Update Background</p>
                                        </label>
                                    </div>}
                                {/* </div> */}
                            </div>
                        </div>

                        <div className='profileNav'>
                            <button
                                className='btn notificationsBtn' onClick={() => handleProfileDisplay('songs')}>
                                {profileUser.user_id === user.user_id ? 'Your Songs' : `${profileUser.username}'s songs`}</button>
                            <button
                                className='btn notificationsBtn' onClick={() => handleProfileDisplay('collab')}>
                                {profileUser.user_id === user.user_id ? 'Your Collabs' : `${profileUser.username}'s Collabs`}<div className='notificationsDiv inline'><Notifications notes={collabNotes} type='collab' useClick={false} token={token} socket={socket} /></div>
                            </button>
                            <button className='btn notificationsBtn' onClick={() => handleProfileDisplay('posts')}>
                                {profileUser.user_id === user.user_id ? 'Your Posts' : `${profileUser.username}'s Posts`}</button>
                            <button className='btn notificationsBtn' onClick={() => handleProfileDisplay('message')}>
                                Messages<div className='notificationsDiv inline'><Notifications notes={messageNotes} type="message" useClick={false} token={token} socket={socket} /></div>
                            </button>
                        </div>

                        {showStatus && <>
                            <div className='flexCol gap flexCtr padTen'>
                                <p>"{user.status}"</p>
                                <div className='flexRow gap'>
                                    <form className='flexcol center'>
                                        <input type='text' placeholder='new status...' onChange={(event) => changedStatus = event.target.value}></input>
                                        <br /> <br />
                                        <input type="submit" className='btn' onClick={(event) => handleStatusChange(event)}></input>
                                    </form>
                                </div>
                            </div>

                        </>}

                        <div className='profileBottomDiv'>

                            {
                                showPromptCheck &&
                                <div className='promptCheckPopup'>
                                    <p className='bigRedX' onClick={() => setShowPromptCheck(false)}>X</p>
                                    <form className='promptCheckForm'>
                                    <input type='text' onChange={(e) => setSongTitle(e.target.value)} className="promptTitle"placeholder='Title' required></input>
                                    <textarea className="promptLyrics" onChange={(e) => setSongLyrics(e.target.value)} placeholder='your lyrics...' required></textarea>
                                    <button type="submit" onClick={(event) => handlePromptSubmit(event, songTitle, songLyrics, promptToCheck)}className='btn'>Submit Prompt</button>

                                    </form>
                                </div>
                            }

                            {
                                !showPromptsFull && <button className='btn getPromptsBtn' onClick={getPrompts}>Get A Prompt</button>
                            }
                            {
                                showPrompts
                                    ? <button className='btn showPromptsBtn' onClick={() => setShowPrompts(false)}>Hide Prompts</button>
                                    : <button className='btn showPromptsBtn' onClick={() => setShowPrompts(true)}>Show Prompts</button>
                            }

                            {
                                showPrompts &&
                                <div className='promptsDiv'>
                                    {prompts.map((prompt, key) => (
                                        <div class="prompt">
                                            <p>Prompt {key + 1}</p>
                                            <br />
                                            <p>{prompt}</p>
                                            <button className='btn submitPromptBtn'
                                                onClick={() => handlePromptClick(prompt)}>Submit</button>
                                        </div>
                                    ))}
                                </div>
                            }


                            {
                                showSongs && <>
                                    {userSongs.length === 0
                                        ? <>
                                            <div></div>
                                            {user.user_id === profileUser.user_id ? <>
                                                <h2 className='noProfileSongs'>You have no songs! <Link className='profileLink' to="/submit">Submit one here</Link></h2>
                                            </>
                                                : <h2 className='noProfileSongs'>{profileUser.username} has no songs!</h2>}
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
                                        <p className='whoChatWith'>Who would you like to chat with?</p>
                                        <div className='convoStatusBoxDiv'>
                                            <div className='blueBox'></div><p className='boxText'>Online</p>
                                        </div>
                                        <div className='convoStatusBoxDiv'>
                                            <div className='redBox'></div><p className='boxText'>Offline</p>
                                        </div>
                                        <div className='newConvoBtnDiv'>{allOtherUsers.map((user, idx) => {
                                            return <button key={idx} className={onlineUsers && onlineUsers.includes(user.username) ? 'online userChatLink btn' : 'userChatLink btn'} onClick={() => createConversation(user)}>{user.username}</button>
                                        })}
                                        </div>
                                    </>}
                                    <button className='btn newConvoBtn' onClick={handleNewConvo}>+new convo</button>

                                    {conversations &&
                                        conversations.map((convo, idx) => {
                                            const filteredMessages = allMessages.filter(mess => mess.conversation_id === convo.conversation_id).sort((a, b) => new Date(a.time) - new Date(b.time))
                                            return <Conversation key={idx} socket={socket} user={user} user1username={convo.user1username} user2username={convo.user2username} user1_id={convo.user1_id} user2_id={convo.user2_id} conversation_id={convo.conversation_id} filteredMessages={filteredMessages} />
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