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
        userName: '',
        email: '',
        isLoggedIn: false,
        profilePic: '',
        score: 0,
        datecreated: ''
      },

    };
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

  test = (data) => {
    console.log(data)
  }

  loadUser = (data) => {
    console.log(data)
    this.setState({
      user: {
        id: data.id,
        userName: data.username,
        email: data.email,
        datecreated: data.datecreated,
        score: data.score,
        isLoggedIn: true,
        profilePic: ''
      }
    },
    () => {
      console.log(this.state.user)
    }
    )
    
  }

render() {
  const isLoggedIn = this.state.user.isLoggedIn;
  return (
    <Router>
      <div className='App'>
        <Nav user={this.state.user}/>
        <div className='spacing'></div>
        {isLoggedIn ? <Profile user={this.state.user}/> : null}
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
