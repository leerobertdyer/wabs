import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login';
import Nav from './Components/Nav/Nav';
import Footer from './Components/Footer/Footer';
import Register from './Components/Register/Register';
import Profile from './Components/Profile/Profile';
import Songs from './Components/Songs/Songs';
import Submit from './Components/Submit/Submit';
import Access from './Components/Access/Access';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        user_id: '',
        userName: '',
        email: '',
        isLoggedIn: false,
        user_profile_pic: '',
        score: 0,
        datecreated: ''
      },
      song: {
        title: '',
        lyrics: '',
        song_file: ''
      },
      isAuthorizing: false

    };
  }

  componentDidMount() {
    this.checkAuthentication();
  }

  checkAuthentication = () => {
    fetch('http://localhost:4000/check-session', { credentials: 'include' })
      .then((response) => {
        if (response.status === 204){
          console.log('No user session stored...')
          return null
        } else{
          console.log('Getting response: ', response)
          return response.json()
        }
      })
      .then((data) => {
        if (data) {
          console.log(data)
          // this.setState({ user: data });
        }
      })
      .catch((error) => {
        console.error('Error checking authentication:', error);
      });
  };



updateSong = (newSong) => {
  console.log('updating song: ')
  console.log('title: ', newSong.title)
  console.log('lyrics: ', newSong.lyrics)
  console.log('song: ', newSong.song)
  this.setState({
    song: {
      title: newSong.title,
      lyrics: newSong.lyrics,
      song_file: newSong.song
    },
    isAuthorizing: true
  }, () => {
    console.log('state set:', this.state.song)
  })
  } 

  loadUser = (data) => {
    console.log(data)
    this.setState({
      user: {
        user_id: data.user_id,
        userName: data.username,
        email: data.user_email,
        datecreated: data.date_user_joined,
        score: data.score,
        isLoggedIn: true,
        user_profile_pic: data.user_profile_pic,
        status: data.user_status
      }
    },
      () => {
        console.log(this.state.user)
      }
    )

  }

  unloadUser = () => {
    fetch('http://localhost:4000/signout', {
      method: 'POST', 
      credentials: 'include',
    })
    .then(response => {
      if (response.ok) {
        this.setState({
          user: {
            user_id: '',
            userName: '',
            email: '',
            isLoggedIn: false,
            user_profile_pic: '',
            score: 0,
            datecreated: ''
          }
        });
      }
    })
    .catch(error => {
      console.error('Logout failed:', error);
    });
  };
  

  render() {

    return (
      <Router>
        <div className='App'>
          {
            <div id='mainWrapper'>
                <Nav user={this.state.user} unloadUser={this.unloadUser} />
                <div className='spacing'></div>
                
                <Routes>
                  <Route path='/' element={<Songs />} />
                  <Route path="/login" element={<Login loadUser={this.loadUser} />} />
                  <Route path="/register" element={<Register loadUser={this.loadUser} />} />
                  <Route path="/profile" element={<Profile user={this.state.user} checkAuthentication={this.checkAuthentication} />} />
                  <Route path="/submit" element={<Submit user={this.state.user} updateSong={this.updateSong} isAuthorizing={this.isAuthorizing} />} />
                  <Route path='/access' element={<Access user={this.state.user} song={this.state.song}/>} />
                </Routes>

                <Footer />
              </div>
          }
        </div>
      </Router>
    );
  }
}

export default App;
