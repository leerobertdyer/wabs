import React, { Component } from 'react';
import './Profile.css'
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            statusInput: false
        }
    }
    handlePhotoSubmit = (event) => {
        const file = event.target.files[0]
        if (file) {
            console.log(file.name)
            //It's working in theory, but will need to send the image to server somehow...
        }
    }

    handleStatusChange = (event) => {
        this.setState({ status: event.target.value })
    }
    toggleInput = () => {
        this.setState({ statusInput: true })
    }

    render() {
        const { profilePic, userName, status, points, statusInput, isLoggedIn } = this.props.user;
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
                                <img src={profilePic} alt="Profile" />
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

                                        {/*  REPLACE WITH AUDIO PLAYER COMPONENT SORTED BY LOGGED IN USER'S SONGS */}
                    <div className='songs'>
                        <h1>SONGS</h1>
                        <div className='row'>
                            <audio controls>
                                <source src="../../Assets/themeSong.mp3" type="audio/mp3" />
                            </audio>
                            <audio controls>
                                <source src="../../Assets/themeSong.mp3" type="audio/mp3" />
                            </audio>
                        </div>
                        <div className='row'>
                            <audio controls>
                                <source src="../../Assets/themeSong.mp3" type="audio/mp3" />
                            </audio>
                            <audio controls>
                                <source src="../../Assets/themeSong.mp3" type="audio/mp3" />
                            </audio>
                        </div>
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
}

export default Profile