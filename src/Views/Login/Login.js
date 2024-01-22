import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
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

    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
  .then((userCredential) => {
    // const user = userCredential.user;
    // console.log(user);
    navigate('/profile')
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
alert(`${errorCode}: ${errorMessage}`);
  });
  }

    return (
      <div id="login">
        <div className='formContainer'>
          <form>
            <fieldset>
              <legend>Login</legend>
              <div>
                <label htmlFor="username">Email:</label>
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
              <Link to="/register" className='registerLink'>Register</Link>
            </fieldset>
          </form>
        </div>
      </div>
    )
  }



export default Login;