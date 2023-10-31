import React, { Component } from 'react';
import './Profile.css'
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Songs from '../Songs/Songs';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            statusInput: false,
            profilePhoto: ''
        }
    }
    handlePhotoSubmit = (event) => {
        const photo = event.target.files[0]
        const user = this.props.user
        if (photo) {
            fetch('http://localhost:4000/editProfilePic', {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    user,
                    photo
                })
            }).then(resp => resp.json())
                .then(photo => {
                    if (photo) {
                        this.setState({profilePhoto: photo})
                    }
                })
    }
}

    handleStatusChange = (event) => {
        this.setState({ status: event.target.value })
    }
    toggleInput = () => {
        this.setState({ statusInput: true })
    }

    render() {
        const { userName, status, points, statusInput, isLoggedIn } = this.props.user;
            return (      
            <div>
                {isLoggedIn ? (
                    <div>
                <div id="outer">
                    <h1>Hello, {userName}!</h1>
                </div>
                <div id="Profile">
                    <div id="topBar">
                        <div className="pad">
                            <div className="profilePic">
                                <img src={this.profilePhoto} alt="Profile" />
                            </div>
                            <button>+pic</button>
                        </div>
                        <div id="mood">
                            <h2 id="moodAndScore">{userName}'s current mood:</h2>
                            {statusInput ? (
                                <form action="">
                                    <input type='text' className="statusInput" onSubmit={this.handleStatusChange}></input>
                                </form>
                            )
                                : (
                                    <p onClick={this.toggleInput}>"{status}"</p>
                                )
                            }
                        </div>
                        <div id="score">
                            <h2 id="moodAndScore">{userName}'s score:</h2>
                            <p className="points">{points}</p>
                            <p className="points">Rank: [rank]</p>
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
}

export default Profile