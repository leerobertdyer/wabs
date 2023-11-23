import { useEffect, useState } from 'react';
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

function App(props) {
  const [user, setUser] = useState({
    user_id: '',
    userName: '',
    email: '',
    isLoggedIn: false,
    user_profile_pic: '',
    score: 0,
    datecreated: ''
  })
  const [songs, setSongs] = useState([])

  useEffect(() => {
    checkAuthentication();
    if (window.location.pathname === '/') {
    loadSongs();
    }
  }, []);


  const loadSongs = async () => {
    try {
      const response = await fetch(`http://localhost:4000/songs?home=home`)
      const data = await response.json()
      console.log('client side song fetch data: ', data.songs)
      setSongs(data.songs)
    } catch (error) {
      console.error("error fetching songs at home: ", error)
    }
  }

  const checkAuthentication = async () => {
    try{
      const response = await fetch('http://localhost:4000/auth/check-session', {
         credentials: 'include'
       })
       const data = await response.json()
       const currentUser = data.user
       // const token = data.token
       console.log('client side user cookie: ', currentUser)
       // console.log('client side token cookie: ', token)
       loadUser(currentUser)
    }
    catch(error) {
        console.error('Error checking authentication:', error);
      };
  };

 const loadUser = (data) => {
    console.log('onLoadUser: ', data)
    setUser({
        user_id: data.user_id,
        userName: data.username,
        email: data.user_email,
        datecreated: data.date_user_joined,
        score: data.score,
        isLoggedIn: true,
        user_profile_pic: data.user_profile_pic,
        status: data.user_status
    },
      () => {
        // console.log('loadUserState: ', state.user)
      });
  }

  const unloadUser = () => {
    try {
     fetch('http://localhost:4000/auth/signout', {
      method: 'POST',
      credentials: 'include',
    })
     setUser({
              user_id: '',
              userName: '',
              email: '',
              isLoggedIn: false,
              user_profile_pic: '',
              score: 0,
              datecreated: ''
            })    
        }
      catch(error) {
        console.error('Logout failed:', error);
      }
  };


    return (
      <Router>
        <div className='App'>
          {
            <div id='mainWrapper'>
              <Nav user={user} unloadUser={unloadUser} />
              <div className='spacing'></div>

              <Routes>
                <Route path='/' element={<Songs songs={songs} />} />
                <Route path="/login" element={<Login loadUser={loadUser} />} />
                <Route path="/register" element={<Register loadUser={loadUser} />} />
                <Route path="/profile" element={<Profile user={user} unloadUser={unloadUser} />} />
                <Route path="/submit" element={<Submit user={user} />} />
                <Route path='/access' element={<Access user={user} songs={songs} />} />
              </Routes>

              <Footer />
            </div>
          }
        </div>
      </Router>
    );
  }

export default App;
