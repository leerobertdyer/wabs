import React, { Component } from 'react';
import './App.css';
import Login from './Components/Login/Login';
import Nav from './Components/Nav/Nav'
import Footer from './Components/Footer/Footer';
import Register from './Components/Register/Register';
import Profile from './Components/Profile/Profile';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      route: "profile",
      user: {
        userName: 'Bilbo',
        email: '',
        isLoggedIn: true,
        profilePic: '',

      }
    }
  }


  
  render() {
    const route = this.state.route
    const userName = this.state.user.userName
    if (route === "home") {
      return (
        <div className='App'>
          <Nav />
          <div id="outer">
            <h1>Write A Bad Song</h1>
          </div>
          <div className='spacing'></div>
          <Login />
          <div className='spacing'></div>
          <Footer />
        </div>
      )
    }
    else if (route === "register") {
      return (
        <div className="App">
          <Nav />
          <div className='spacing'></div>
          <Register />
          <div className='spacing'></div>
          <Footer />
        </div>
      )
    }
    else if (route === "profile") {
      return (
        <div className="App">
          <Nav />
          <div id="outer">
            <h1>Hello, { userName }</h1>
          </div>
          <Profile />
          <Footer />
        </div>
      )
    }
    else {
      return (
        <div className="other">
          <p>Other Routes Go Here</p>
        </div>
      )
    }

  }

}

export default App;
