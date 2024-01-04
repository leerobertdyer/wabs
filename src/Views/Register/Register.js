import { NavLink } from "react-router-dom";
import './Register.css'
import { useEffect, useState } from "react"
import { auth, fdb } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";


function Register({ loadUser }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [allUsers, setAllUsers] = useState([]);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchAllUsers = async () => {
            const resp = await fetch(`${BACKEND_URL}/auth/get-all-emails`);
            if (resp.ok) {
                const data = await resp.json();
                setAllUsers(data.allUsers)
            }
        }
        fetchAllUsers();
    }, [BACKEND_URL])

    const onRegisterSubmit = async (event) => {
        event.preventDefault()
        if (allUsers.includes(email)) {
            alert('Email is already taken');
            return;
        } else if (allUsers.includes(username)) {
            alert('User name is already taken');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const NINJA_URL = "https://api.api-ninjas.com/v1/"
            const NINJA_KEY = process.env.REACT_APP_NINJA_API_KEY;

            const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_KEY;
            const unsplashUrl = `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_KEY}`;
            const getRandomPhoto = async (query) => {
                const resp = await fetch(`${unsplashUrl}&query=${query}`)
                if (resp.ok) {
                    const data = await resp.json();
                    return data
                }
            }
            const naturePhotoData = await getRandomPhoto('nature');
            const naturePhotoLink = naturePhotoData.urls.full

            const animalPhotoData = await getRandomPhoto('animals')
            const animalPhotoLink = animalPhotoData.urls.full

            const fetchNewUserStatus = async () => {
                const resp = await fetch(`${NINJA_URL}/jokes`, {
                    headers: { 'X-Api-Key': NINJA_KEY, 'Accept': 'image/jpg' }
                });
                if (resp.ok) {
                    const data = await resp.json();
                    const joke = data[0].joke
                    return joke
                }
            }
            const status = await fetchNewUserStatus();

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const firebaseToken = await user.getIdToken();

            const response = await fetch(`${BACKEND_URL}/auth/register`, {
                method: "POST",
                headers: {'content-type': 'application/json'},
                body: JSON.stringify({
                    "username": username.toLowerCase(),
                    "email": email,
                    "UID": user.uid,
                    "status": status,
                    "profile_pic": animalPhotoLink,
                    "background_pic": naturePhotoLink
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create a new user register.js(36)');
            }

            const data = await response.json();
            console.log('user after /auth/register: ', data);
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

                // console.log(authUrl);
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
                        <div>
                            <label htmlFor="confirmPassword">Confirm Password:</label>
                            <input className="formInput"
                                type="password"
                                placeholder='**top*secret**'
                                id="confirmPassword" name="confirmPassword"
                                onChange={(event) => setConfirmPassword(event.target.value)} />
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