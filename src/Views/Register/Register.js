import { NavLink } from "react-router-dom";
import './Register.css'
import { useState } from "react"
import { auth, fdb } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

function Register({ loadUser }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL


const onRegisterSubmit = (event) => {
        event.preventDefault()

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
            const user = userCredential.user;
            console.log(user.uid);
            console.log(username);
            return fetch(`${BACKEND_URL}/auth/register`, {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                "username": username.toLowerCase(),
                "email": email,
                "UID": user.uid
                })
            })
            }).then(resp => {
                if (!resp.ok) {
                    throw new Error('Failed to create new user register.js(36)')
                }
                return resp.json();
            }).then(data => {
                loadUser(data)
                setDoc(doc(fdb, "users", username), data)
                if (data.user_id) {
                    return fetch(`${BACKEND_URL}/auth/dbx-auth`, {
                        method: 'POST',
                        headers: { 'content-type': 'application/json' }
                    })
                }})
                    .then(authUrlResponse => {
                        if (!authUrlResponse.ok) {
                        throw new Error(`Failed to get auth URL: ${authUrlResponse.status}`);
                    }
                    return authUrlResponse.json();
                    }).then(data => {
                        console.log(data);
                        const authUrl = data.authUrl;
                        console.log('authurl: ', authUrl)
                            
                    window.open(authUrl, '_blank')
                    // window.location.href = authUrl
                    })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
                alert(`${errorCode}: ${errorMessage}`)
            });
      

//OLDER VERSION : 
    //     try {
    //         const registerResponse = await
    //         fetch(`${BACKEND_URL}/auth/register`, {
    //             method: "POST",
    //             headers: { 'content-type': 'application/json' },
    //             body: JSON.stringify({
    //                 "username": username.toLowerCase(),
    //                 "email": email.toLowerCase(),
    //                 "password": password
    //             }),
    //                 credentials: 'include'
    //             })
    //             console.log('object');

    //         const user = await registerResponse.json()
    //         console.log('Registered user: ', user)
    //         console.log('client side cookie: ', document.cookie);
    //         props.loadUser(user);

    //         if (user.user_id) {
    //             const authUrlResponse = await fetch(`${BACKEND_URL}/auth/dbx-auth`, {
    //                 method: 'POST',
    //                 headers: { 'content-type': 'application/json' },
    //                 credentials: 'include'
    //             })

    //             if (!authUrlResponse.ok) {
    //                 throw new Error(`Failed to get auth URL: ${authUrlResponse.status}`);
    //             }

    //             const authData = await authUrlResponse.json();
    //             const authUrl = authData.authUrl

    //             console.log('authData', authData)
    //             console.log('authurl: ', authUrl)

    //             // window.open(authUrl, '_blank')
    //             window.location.href = authUrl
    //         }

    //     }
    //     catch (error) {
    //         console.error('Error during user Registration:', error);
    //     }
    }

    return (
        <div id="Register">
            <div className="formContainer">
                <form method="POST" onSubmit={onRegisterSubmit}>
                    <fieldset>
                        <legend>Register</legend>
                        <div>
                            <label htmlFor="userName">User Name:</label>
                            <input className="formInput"
                                type="text"
                                placeholder='lee_boy_69'
                                name="userName" id="userName"
                                onChange={(event) => setUsername(event.target.value)} />
                            <label htmlFor="email">Email:</label>
                            <input className="formInput" type="email" placeholder='lee@tinysunstudio.com' name="email" id="email" onChange={(event) => setEmail(event.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="password">Password:</label>
                            <input className="formInput"
                                type="password"
                                placeholder='**top*secret**'
                                id="password" name="password"
                                onChange={(event) => setPassword(event.target.value)} />
                        </div>
                        <button className="formSubmitButton"
                            type='submit' id="submit">Submit</button>
                        <NavLink to="/Login"
                            className={({ isActive }) => (isActive ? 'active' : '')}>Login</NavLink>
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

export default Register;