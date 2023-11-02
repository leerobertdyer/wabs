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
    

    const handleStatusChange = (event) => {
        setStatus(event.target.value)
    }

    const { userName, points, isLoggedIn } = props.user;

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <div id="outer">
                        <h1>Hello, {userName}!</h1>
                    </div>
                    <div id="Profile">
                        <div id="topBar">
                            <div id="picInputStatus">
                            <div id="picAndInput">
                                <div className="profilePicContainer">
                                    <img src={profilePhoto} alt="Profile" className='profilePic' />
                                </div>
                                <form encType="multipart/form-data">
                                    <label htmlFor="filePicker">+pic</label>
                                    <input
                                        type="file"
                                        id="filePicker"
                                        name="photo"
                                        accept="image/png, image/jpeg"
                                        style={{ display: 'none' }}
                                        onChange={handlePhotoSubmit}
                                    />
                                </form></div>
                                <h3 className="status">{status}</h3>
                                
                            </div>
                            <div id="scoreConCon">
                            <div className="scoreContainer">
                                <h2 id="moodAndScore">{userName}'s score:</h2>
                                <p className="points">{points}</p>
                                <p className="points">Rank: [rank]</p>
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