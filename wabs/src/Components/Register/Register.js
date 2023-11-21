import { NavLink } from "react-router-dom";
import './Register.css'
import { useState } from "react";

function Register(props) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onRegisterSubmit = async (event) => {
        event.preventDefault()
        try {
            const registerResponse = await
                fetch('http://localhost:4000/auth/register', {
                    method: "POST",
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({
                        "username": username.toLowerCase(),
                        "email": email.toLowerCase(),
                        "password": password
                    }),
                    credentials: 'include'
                })

            const user = await registerResponse.json()
            console.log('Registered user: ', user)
            console.log('client side cookie: ', document.cookie);
            props.loadUser(user);
            if (user.user_id) {
                const authUrlResponse = await fetch('http://localhost:4000/auth/dbx-auth', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    credentials: 'include'
                })
                console.log('wtf')
                if (!authUrlResponse.ok) {
                    throw new Error(`Failed to get auth URL: ${authUrlResponse.status}`);
                }

                const authData = await authUrlResponse.json();
                const authUrl = authData.authUrl.replace(/\s/g, "%20")

                console.log('authData', authData)
                console.log('authurl: ', authUrl)

                // window.open(authUrl, '_blank')
                window.location.href = authUrl
            }

        }
        catch (error) {
            console.error('Error during user Registration:', error);
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