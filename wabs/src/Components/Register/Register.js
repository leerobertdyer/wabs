import React from "react";
import './Register.css'

function Register() {

        return(
            <div id="Register">
                <fieldset>
                <legend>Register</legend>
                <div>
                <label htmlFor="userName">User Name:</label>
                <input type="text" placeholder='lee_boy_69' name="userName" id="userName" />
                <label htmlFor="email">Email:</label>
                <input type="email" placeholder='lee@tinysunstudio.com' name="email" id="email" />
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
    
export default Register;