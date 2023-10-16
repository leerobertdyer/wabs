import React, { Component } from 'react';
import './Nav.css';

class Nav extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedin: false
        }
    }

    render() {
        return (
        <div id="nav">
            <p class="links">Home</p> 
            <p class="links">Profile</p> 
            <p class="links">Submit</p> 
            <p class="links">Collaborate</p> 

        </div>
        )
    }

}

export default Nav;