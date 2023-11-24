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
    status: '',
    score: 0,
    datecreated: ''
  })

  const [songs, setSongs] = useState([])

  useEffect(() => {

    const checkAuthentication = async () => {
      try{
        const response = await fetch('http://localhost:4000/auth/check-session', {
           credentials: 'include'
         })
         console.log('client side cookie: ', document.cookie)
         const data = await response.json()
         const currentUser = data.user
         loadUser(currentUser)
      }
      catch(error) {
          console.error('Error checking authentication:', error);
        };
    };

    checkAuthentication();
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      const response = await fetch(`http://localhost:4000/songs`)
      const data = await response.json()
      setSongs(data.songs)
    } catch (error) {
      console.error("error fetching songs at home: ", error)
    }
  }

  const changeUserPic = (newPic) => {
    const nextUser = {...user, user_profile_pic: newPic};
    setUser(nextUser);
  }

  const changeUserStatus = (newStatus) => {
    const nextUser = {...user, status: newStatus};
    setUser(nextUser);
  }
  
 const loadUser = (data) => {
    setUser({
        user_id: data.user_id,
        userName: data.username,
        email: data.user_email,
        datecreated: data.date_user_joined,
        score: data.score,
        isLoggedIn: true,
        user_profile_pic: data.user_profile_pic,
        status: data.user_status
    })
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
                <Route path="/profile" element={<Profile user={user} changeUserPic={changeUserPic} changeUserStatus={changeUserStatus} loadSongs={loadSongs} songs={songs} unloadUser={unloadUser} />} />
                <Route path="/submit" element={<Submit user={user} loadSongs={loadSongs} />} />
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
