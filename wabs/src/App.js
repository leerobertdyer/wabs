import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login';
import Nav from './Components/Nav/Nav';
import Footer from './Components/Footer/Footer';
import Register from './Components/Register/Register';
import Profile from './Components/Profile/Profile';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        userName: 'Bilbo',
        email: '',
        isLoggedIn: true,
        profilePic: '',
      },

    };
  }
render() {
  return (
    <Router>
      <div className='App'>
        <Nav />
        <div className='spacing'></div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <Profile
                user={{
                  userName: 'Bilbo',
                  email: '',
                  isLoggedIn: true,
                  profilePic: '',
                }}
              />
            }
          />
          <Route
            path="/"
            element={
              <div>
              <div id="outer">
              <h1>Write A Bad Song</h1>
            </div>
              <div className="other">
                <p>HOME ROUTE</p>
              </div>
              </div>
            }
          />
        </Routes>
        <div className='spacing'></div>
        <Footer />
      </div>
    </Router>
  );
}
}

export default App;
