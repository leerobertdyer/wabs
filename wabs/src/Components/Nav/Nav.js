import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Nav.css';


// Using P elements right now. 
// Will need to update using react's built in link component
// and route handling...

class Nav extends Component {
    render() {
        const { user, unloadUser } = this.props
        return (
            <div>
                <div id="nav">
                    <img src='../../Assets/logo.png' alt="logo" width="100px" />
                    <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : 'links')}>Home</NavLink>

                    <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : 'links')}>Profile</NavLink>     

                    <NavLink to="/submit" className={({ isActive }) => (isActive ? 'active' : 'links')}>Submit</NavLink>

                    <NavLink to="/collaborate" className={({ isActive }) => (isActive ? 'active' : 'links')}>Collaborate</NavLink>

                    <div id="loginBox">
                    <Link 
                    to={user.isLoggedIn ? "/" : "/login"}
                    onClick={user.isLoggedIn ? unloadUser : null}>
                    {user.isLoggedIn ? 'Sign Out' : 'Login'}
                    </Link>
                    </div>                   
                    
                </div>

            </div>
        )
    }

}

export default Nav;