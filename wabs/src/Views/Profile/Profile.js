import React, { useState } from 'react';
import './Profile.css'
import { Link } from 'react-router-dom';
import Feed from '../../Components/Feed/Feed';

function Profile({ feed, user, changeUserPic, loadSongs, loadFeed, sortFeed, changeUserStatus }) {

    const [showStatus, setShowStatus] = useState(false);

    const userSongs = feed
    .filter((post) => post.user_id === user.user_id && post.type === "song")
    .sort((a, b) => new Date(b.song_date) - new Date(a.song_date));

    const handleSetProfilePhoto = (newPhoto) => changeUserPic(newPhoto)

    const handlePhotoSubmit = async (event) => {
        const ogPhoto = user.user_profile_pic
        const photo = event.target.files[0];
        try {
            if (photo) {
                const temp = URL.createObjectURL(photo);
                handleSetProfilePhoto(temp)
                const formData = new FormData();
                formData.append('user_id', user.user_id);
                formData.append('photo', photo);
                const response = await fetch('http://localhost:4000/profile/upload-profile-pic', {
                    method: "PUT",
                    body: formData,
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json()
                    handleSetProfilePhoto(data.newPhoto)
                    loadSongs()
                    // console.log('photo saved in dbx: ', data.newPhoto);
                }
                else {
                    console.log(`Failed to upload your photo to dropbox: ${response.status}`);
                    handlePhotoSubmit(ogPhoto)
                }
            }
        } catch (error) {
            console.error('Error:', error.message);
        };
    }

    let changedStatus = ''
    const showHiddenStatus = () => {
        if (!showStatus) {
            setShowStatus(true);
        }
        else { setShowStatus(false) }
    }

    const handleStatusChange = async (event) => {
        event.preventDefault();
        if (changedStatus.length > 0) {
            const response = await fetch('http://localhost:4000/profile/update-status', {
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
                setShowStatus(false)
            } else {
                throw new Error(`Failed to upload yer new statatus: ${response.status}`)
            }
        } else {
            setShowStatus(false)
            return null;
        }
    }

    const { isLoggedIn } = user;

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <div id="Profile">
                        <div id="topBar">
                            <div id="picInputStatus">
                                <div id="picAndInput">
                                    <div className="profilePicContainer">
                                        <img src={user.user_profile_pic} alt="Profile" className='profilePic' />
                                    </div>
                                    <form encType="multipart/form-data">
                                        <label className="picInputLabel clickMe"
                                            htmlFor="filePicker">+pic</label>
                                        <input
                                            type="file"
                                            id="filePicker"
                                            name="photo"
                                            accept="image/png, image/jpeg"
                                            style={{ display: 'none' }}
                                            onChange={handlePhotoSubmit}
                                        />
                                    </form></div>
                                <div id="statusAndInput">
                                    <h3 className="status">"{user.status}"</h3>
                                    <form className='formRow'>
                                        {/* <label htmlFor="statusInput">
                                        +status
                                    </label> */}
                                        <label htmlFor="statusChanger"
                                            className='labelInline clickMe'
                                            onClick={showHiddenStatus}>+status</label>
                                        {showStatus ? (
                                            <div className='formRow'>
                                                <input type="text"
                                                    id="statusChanger"
                                                    name="statusInput"
                                                    onChange={(event) => changedStatus = event.target.value} />
                                                <input type="submit"
                                                    className='clickMe smallFormButton'
                                                    onClick={handleStatusChange} />
                                            </div>) : null}
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Feed user={user} showSort={false} feed={userSongs} loadFeed={loadFeed} sortFeed={sortFeed} />
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