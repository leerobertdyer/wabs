import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login(props) {
const [loginEmail, setLoginEmail] = useState('')
const [loginPassword, setLoginPassword] = useState('')

  const navigate = useNavigate();

 const onEmailChange = (event) => {
    event.preventDefault();
    setLoginEmail(event.target.value)
  }

  const onPasswordChange = (event) => {
    setLoginPassword(event.target.value)
  }

  const onSubmitSignin = (event) => {
    event.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      return;
    }
    fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword
      }),
      credentials: 'include'
    })
      .then(resp => resp.json())
      .then(user => {
        console.log('successful login...')
        console.log('allcookies after login: ', document.cookie)
        if (user.user_id) {
          props.loadUser(user);
          navigate('/profile');
        }

      })
  }

    return (
      <div id="login">
        <div className='formContainer'>
          <form>
            <fieldset>
              <legend>Login</legend>
              <div>
                <label htmlFor="username">Username/Email:</label>
                <input className="formInput" 
                type="text" 
                placeholder='David Blowie' 
                name="username" id="username" 
                onChange={onEmailChange} />
              </div>
              <div>
                <label htmlFor="password">Password:</label>
                <input className="formInput" 
                type="password" 
                placeholder='**top*secret**' 
                id="password" name="password" 
                onChange={onPasswordChange} />
              </div>
              <button className="formSubmitButton" 
              type='submit' id="submit" 
              onClick={onSubmitSignin}>Submit</button>
              <Link to="/register">Register</Link>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }



export default Login;