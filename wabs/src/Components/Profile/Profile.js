import React, { useRef, useState } from 'react';
import './Profile.css'
import { Link } from 'react-router-dom';
import Songs from '../Songs/Songs';

function Profile(props) {
    const user = props.user
    const serverUrl = 'http://localhost:4000';
    const filename = user.profilephoto
    const profilePhotoUrl = `${serverUrl}/uploads/photos/${filename}`
    const [profilePhoto, setProfilePhoto] = useState(profilePhotoUrl);
    const [status, setStatus] = useState(props.user.status)
    const [showStatus, setShowStatus] = useState(false)

    const handleSetProfilePhoto = (lastPhotoVar) => {
        setProfilePhoto(`${serverUrl}/uploads/photos/${lastPhotoVar}`)
    }

    const handlePhotoSubmit = (event) => {
        const photo = event.target.files[0];
        if (photo) {
            const formData = new FormData();
            formData.append('user[id]', user.id);
            formData.append('photo', photo);
            fetch('http://localhost:4000/upload-profile-pic', {
                method: "PUT",
                body: formData,
            })
                .then(response => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        throw new Error(`Failed to upload yer damn photo: ${response.status}`);
                    }
                }).then(data => {
                    handleSetProfilePhoto(data.newPhoto);
                })
                .catch(error => {
                    console.error('Error:', error.message);
                });
        }
    }

    let changedStatus = ''
    const showHiddenStatus = () => {
        if (!showStatus){
        setShowStatus(true);}
        else {setShowStatus(false)}
    }
    const handleStatusChange = (event) => {
        event.preventDefault();
        if (changedStatus.length > 0){
        fetch('http://localhost:4000/update-status', {
            headers: { 'content-type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify({
                id: user.id,
                newStatus: changedStatus
            })
        })
            .then(resp => {
                if (resp.ok) {
                    return resp.json()
                } else { throw new Error(`Failed to upload yer new statatus: ${resp.status}`) }
            }).then(data => {
                setStatus(data.status)
                setShowStatus(false)
            })} else {
                setShowStatus(false)
                return null;
            }
    }


    const { userName, score, isLoggedIn } = props.user;
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
                                            </div>) : null }
                                    </form>
                                </div>
                            </div>
                        </div>
                        <Songs />
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