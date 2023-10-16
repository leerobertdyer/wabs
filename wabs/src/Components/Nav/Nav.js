import React, { Component } from 'react';
import './Nav.css';


// Using P elements right now. 
// Will need to update using react's built in link component
// and route handling...

class Nav extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedin: false
        }
    }

    render() {
        return (
            <div>
                <div id="nav">
                    <img src='../../Assets/logo.png' alt="logo" width="100px" />
                    <p className="links">Home</p>
                    <p className="links">Profile</p>
                    <p className="links">Submit</p>
                    <p className="links">Collaborate</p>
                    <img src='../../Assets/logo.png' alt="logo" width="100px" />
                </div>
                <div id="outer">
                    <h1>Write A Bad Song</h1>
                </div>
            </div>
        )
    }

}

export default Nav;