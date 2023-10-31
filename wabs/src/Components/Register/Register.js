import { NavLink, useNavigate } from "react-router-dom";
import './Register.css'
import { useState } from "react";

function Register(props) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registered, setRegistered] = useState(false)
    const navigate = useNavigate();


    const onRegisterSubmit = (event) => {
        event.preventDefault()
        fetch('http://localhost:4000/register', {
            method: "POST",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password": password
            })
        }).then(resp => resp.json())
            .then(user => {
                if (user) {
                    props.loadUser(user);
                    setRegistered(true)
                }
            })
    }

    if (registered) {
        navigate('/');
        return null;
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