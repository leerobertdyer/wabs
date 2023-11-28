import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login/Login';
import Nav from './Components/Nav/Nav';
import Footer from './Components/Footer/Footer';
import Register from './Components/Register/Register';
import Profile from './Components/Profile/Profile';
import Feed from './Components/Feed/Feed';
import Submit from './Components/Submit/Submit';

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
  const [feed, setFeed] = useState([])

  useEffect(() => {

    const checkAuthentication = async () => {
      try{
        const response = await fetch('http://localhost:4000/auth/check-session', {
           credentials: 'include'
         })
        //  console.log('client side cookie: ', document.cookie)
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
    loadFeed();
  }, []);

  const loadFeed = async() => {
    const resp = await fetch('http://localhost:4000/feed')
    const data = await resp.json();
    console.log('feed data: ', data.newFeed)
    setFeed(data.newFeed)
  }

  const sortFeed = (method) => {
    let nextFeed
    if (method === "Oldest"){
      nextFeed = [...feed].sort((a, b) => a.feed_id - b.feed_id)
    }
    else if (method === "Latest"){
      nextFeed = [...feed].sort((a, b) => b.feed_id - a.feed_id)
    }
    else if (method === "Most Popular"){
      nextFeed = [...feed].sort((a, b) => b.stars - a.stars)
    }
    else {
      console.log('nothing changed...')
      nextFeed = [...feed]
    }
    setFeed(nextFeed)
  }
  
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
                <Route path='/' element={<Feed feed={feed} user={user} loadFeed={loadFeed} sortFeed={sortFeed}/>} />
                <Route path="/login" element={<Login loadUser={loadUser} />} />
                <Route path="/register" element={<Register loadUser={loadUser} />} />
                <Route path="/profile" element={<Profile user={user} changeUserPic={changeUserPic} changeUserStatus={changeUserStatus} loadSongs={loadSongs} loadFeed={loadFeed} songs={songs} unloadUser={unloadUser} />} />
                <Route path="/submit" element={<Submit user={user} loadSongs={loadSongs} loadFeed={loadFeed}/>} />
              </Routes>

              <Footer />
            </div>
          }
        </div>
      </Router>
    );
  }

export default App;
