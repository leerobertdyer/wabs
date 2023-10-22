import React, {Component} from "react";
import { NavLink } from "react-router-dom";
import './Register.css'



class Register extends Component {
constructor(props) {
    super(props)
    this.state = {
        username: '',
        email: '',
        password: ''
    }

}

onUserNameChange = (event) => {
this.setState({username: event.target.value})
console.log(this.state.username)
}

onEmailChange = (event) => {
this.setState({email: event.target.value})
console.log(this.state.email)
}

onPasswordChange = (event) => {
this.setState({password: event.target.value})
console.log(this.state.password)
}

onRegisterSubmit = () => {
    fetch('http://localhost:4000/register', {
    method: "POST",
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password
    })
    })
}

    render() {
        return(
            <div id="Register">
                <form>
                <fieldset>
                <legend>Register</legend>
                <div>
                <label htmlFor="userName">User Name:</label>
                <input type="text" placeholder='lee_boy_69' name="userName" id="userName" onChange={this.onUserNameChange}/>
                <label htmlFor="email">Email:</label>
                <input type="email" placeholder='lee@tinysunstudio.com' name="email" id="email"onChange={this.onEmailChange} />
                </div>
                <div>
                <label htmlFor="password">Password:</label>
                <input type="password" placeholder='**top*secret**'id="password" name="password" onChange={this.onPasswordChange}/>
                </div>
                <button type='submit' id="submit" onClick={this.onRegisterSubmit}>Submit</button>
                <NavLink to="/Login"className={({ isActive }) => (isActive ? 'active' : '')}>Login</NavLink>
                </fieldset>
                </form>
            </div>
        )
    }
}

export default Register;