import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';


class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loginEmail: '',
      loginPassword: ''
    }

  }
  onEmailChange = (event) => {
    event.preventDefault();
    this.setState({ loginEmail: event.target.value })
  }

  onPasswordChange = (event) => {
    this.setState({ loginPassword: event.target.value })
  }

  onSubmitSignin = (event) => {
    event.preventDefault();
    const { loginEmail, loginPassword } = this.state;
    if (!loginEmail.trim() || !loginPassword.trim()) {
      return;
    }

    fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: this.state.loginEmail,
        password: this.state.loginPassword
      })
    })
      .then(resp => resp.json())
      .then(user => {
        if (user.id) {
          this.props.loadUser(user);
        }

      })
  }

  render() {
    return (
      <div id="login">
        <div className='formContainer'>
          <form>
            <fieldset>
              <legend>Login</legend>
              <div>
                <label htmlFor="username">Username/Email:</label>
                <input className="formInput" type="text" placeholder='David Blowie' name="username" id="username" onChange={this.onEmailChange} />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input className="formInput" type="password" placeholder='**top*secret**' id="password" name="password" onChange={this.onPasswordChange} />
              </div>
              <button className="formSubmitButton" type='submit' id="submit" onClick={this.onSubmitSignin}>Submit</button>
              <Link to="/register">Register</Link>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }

}

export default Login;