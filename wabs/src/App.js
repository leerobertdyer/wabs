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
        id: '',
        userName: 'Bilbo',
        email: '',
        isLoggedIn: true,
        profilePic: '',
        score: 0
      },

    };
    this.loadUser = this.loadUser.bind(this);
  }

  // componentDidMount() {
  //   // not sure I need a home fetch...
  //   fetch('http://localhost:4000/')
  //     .then((response) => response.json())
  //     .then((data) => {
  //           console.log(data)
  //         },
  //       )
  //   .catch((error) => {
  //       console.error('Error:', error);
  //     });
  // }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        userName: data.userName,
        email: data.email,
        joined: data.datecreated,
        score: data.score,
        isLoggedIn: true
      }
    })
  }

render() {
  return (
    <Router>
      <div className='App'>
        <Nav />
        <div className='spacing'></div>
        <Routes>
          <Route path="/login" element={<Login loadUser={this.loadUser}/>} />
          <Route path="/register" element={<Register loadUser={this.loadUser}/>} />
          <Route
          path="/profile"
          element={
         <Profile user={this.state.user} />
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
