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


    const onRegisterSubmit = async (event) => {
        event.preventDefault()

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log(user.uid);
            console.log(username);

            const firebaseToken = await user.getIdToken();

            const response = await fetch(`${BACKEND_URL}/auth/register`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${firebaseToken}`,
                },
                body: JSON.stringify({
                    "username": username.toLowerCase(),
                    "email": email,
                    "UID": user.uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create a new user register.js(36)');
            }

            const data = await response.json();
            loadUser(data);
            setDoc(doc(fdb, "users", username), data);

            if (data.user_id) {
                const authUrlResponse = await fetch(`${BACKEND_URL}/auth/dbx-auth`, {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        'Authorization': `Bearer ${firebaseToken}`,
                    },

                });

                if (!authUrlResponse.ok) {
                    throw new Error(`Failed to get auth URL: ${authUrlResponse.status}`);
                }

                const authUrlData = await authUrlResponse.json();
                const authUrl = authUrlData.authUrl;

                console.log(authUrl);
                //   window.open(authUrl, '_blank');
                window.location.href = authUrl

            }
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`${errorCode}: ${errorMessage}`);
        }
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