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

  componentDidMount() {
    // Fetch homepage data from your server
    fetch('http://localhost:4000/')
      .then((response) => response.json())
      .then((data) => {
        // Update the state with the fetched data
        // this.setState({
        //   user: {
        //     ...this.state.user,
            // Assuming the server response is an array of user objects
            // Update 'users' state property with the fetched data
            // users: data,
            console.log(data)
          },
        )
    .catch((error) => {
        console.error('Error:', error);
      });
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
