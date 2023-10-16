import React, { Component } from 'react';
import './Login.css';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            isLoggedIn: false
        }
    }

    render() {
        return(
            <div id="login">
                <fieldset>
                <legend>Login</legend>
                <div>
                <label htmlFor="username">Username/Email:</label>
                <input type="text" placeholder='David Blowie' name="username" id="username" />
                </div>
                <div>
                <label htmlFor="password">Password:</label>
                <input type="password" placeholder='**top*secret**'id="password" name="password" />
                </div>
                <button type='submit' id="submit">Submit</button>
                </fieldset>
            </div>
        )
    }

}

export default Login;