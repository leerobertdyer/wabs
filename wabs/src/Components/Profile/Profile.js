import React, { Component } from 'react';
import './Profile.css'


class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userName: 'Bilbo',
            status: 'Working on it...',
            profilePic: '../../Assets/logo.png',
            songs: [],
            points: 100,
            badges: [],
            isLoggedIn: false,
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
        const { profilePic, userName, status, points, statusInput } = this.state;

        return (
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
        )
    }
}
export default Profile