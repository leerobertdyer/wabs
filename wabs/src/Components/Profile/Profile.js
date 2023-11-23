import React, { useState, useEffect } from 'react';
import './Profile.css'
import { Link } from 'react-router-dom';
import Songs from '../Songs/Songs';

function Profile(props) {
    const user = props.user
    const [profilePhoto, setProfilePhoto] = useState(user.user_profile_pic);
    const [status, setStatus] = useState(props.user.status);
    const [showStatus, setShowStatus] = useState(false);
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        updateProfile(props.user)
    }, [props.user]);

    const updateProfile = (currentUser) => {
        setProfilePhoto(currentUser.user_profile_pic);
        fetchUserSongs(currentUser.user_id)
        setStatus(currentUser.status);
    }

    const fetchUserSongs = async (userId) => {
        try {
            const response = await fetch(`http://localhost:4000/songs/?userId=${userId}`)
            if (response.ok) {
                const data = await response.json();
                setSongs(data.songs)
            } else { throw new Error(`Failed to upload user ${userId}'s songs: ${response.status}`) }
        } catch (error) {
            console.error('Error fetching user songs:', error);
        }
    }

    const handleSetProfilePhoto = (newPhoto) => {
        // console.log('newPhoto: ', newPhoto)
        setProfilePhoto(newPhoto)
        
    }

    const handlePhotoSubmit = (event) => {
        const photo = event.target.files[0];

        console.log('profilepic uploaded: ', photo)
        if (photo) {
            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('photo', photo);
            fetch('http://localhost:4000/profile/upload-profile-pic', {
                method: "PUT",
                body: formData,
                credentials: 'include'
            })
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error(`Failed to upload yer damn photo: ${response.status}`);
                    }
                }).then(data => {
                    // console.log('handlephotosubmit data: ', data)
                    handleSetProfilePhoto(data.newPhoto);
                })
                .catch(error => {
                    console.error('Error:', error.message);
                });
        }
    }

    let changedStatus = ''
    const showHiddenStatus = () => {
        if (!showStatus) {
            setShowStatus(true);
        }
        else { setShowStatus(false) }
    }
    const handleStatusChange = (event) => {
        event.preventDefault();
        if (changedStatus.length > 0) {
            fetch('http://localhost:4000/profile/update-status', {
                headers: { 'content-type': 'application/json' },
                method: 'PUT',
                body: JSON.stringify({
                    id: user.user_id,
                    newStatus: changedStatus
                }),
                credentials: 'include'
            })
                .then(resp => {
                    if (resp.ok) {
                        return resp.json()
                    } else { throw new Error(`Failed to upload yer new statatus: ${resp.status}`) }
                }).then(data => {
                    setStatus(data.status)
                    setShowStatus(false)
                })
        } else {
            setShowStatus(false)
            return null;
        }
    }


    const { isLoggedIn } = props.user;
    // console.log('profile user: ', props.user)
    // console.log('is user logged in? ', isLoggedIn)
    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <div id="Profile">
                        <div id="topBar">
                            <div id="picInputStatus">
                                <div id="picAndInput">
                                    <div className="profilePicContainer">
                                        <img src={profilePhoto} alt="Profile" className='profilePic' />
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
                                    <h3 className="status">"{status}"</h3>
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
                            <Songs user={user} songs={songs} />
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