import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Views/Login/Login';
import Nav from './Components/Nav/Nav';
import Footer from './Components/Footer/Footer';
import Register from './Views/Register/Register';
import Profile from './Views/Profile/Profile';
import Feed from './Components/Feed/Feed';
import Submit from './Views/Submit/Submit';
import { setup } from 'plyr';

function App() {
  const [user, setUser] = useState({
    user_id: '',
    userName: '',
    email: '',
    isLoggedIn: false,
    user_profile_pic: '',
    status: '',
    score: 0,
    datecreated: '',
    collab: 'false'
  })

  const [feed, setFeed] = useState([])
  const [collabFeed, setCollabFeed] = useState([])

  useEffect(() => {

    const checkAuthentication = async () => {
      try {
        const response = await fetch('http://localhost:4000/auth/check-session', {
          credentials: 'include'
        })
        //  console.log('client side cookie: ', document.cookie)
        const data = await response.json()
        const currentUser = data.user
        loadUser(currentUser)
      }
      catch (error) {
        console.error('Error checking authentication:', error);
      };
    };

    checkAuthentication();
    loadFeed();

  }, []);

  const loadFeed = async () => {
    const resp = await fetch('http://localhost:4000/feed')
    const data = await resp.json();
    // console.log('feed data: ', data.newFeed)
    setFeed(data.newFeed)
    setCollabFeed(data.filteredFeed)
  }

  const sortFeed = (method, currentFeed, type) => {
    let nextFeed
    if (method === "Oldest") {
      nextFeed = [...currentFeed].sort((a, b) => a.feed_id - b.feed_id)
    }
    else if (method === "Latest") {
      nextFeed = [...currentFeed].sort((a, b) => b.feed_id - a.feed_id)
    }
    else if (method === "Most Popular") {
      nextFeed = [...currentFeed].sort((a, b) => b.stars - a.stars)
    }
    else {
      console.log('nothing changed...')
      nextFeed = [...currentFeed]
    }
    if (type === 'home') {
      setFeed(nextFeed)
    } else if (type === 'collab') {
      setCollabFeed(nextFeed)
    }
  }

  const changeUserPic = (newPic) => {
    const nextUser = { ...user, user_profile_pic: newPic };
    setUser(nextUser);
  }

  const changeUserStatus = (newStatus) => {
    const nextUser = { ...user, status: newStatus };
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
      status: data.user_status,
      collab: data.collab
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
        datecreated: '',
        collab: false
      })
    }
    catch (error) {
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
              <Route path='/' element={<Feed showSort={true} feed={feed} user={user} loadFeed={loadFeed} sortFeed={sortFeed} />} />
              <Route path="/login" element={<Login loadUser={loadUser} />} />
              <Route path="/register" element={<Register loadUser={loadUser} />} />
              <Route path="/profile" element={<Profile user={user} changeUserPic={changeUserPic} loadUser={loadUser} changeUserStatus={changeUserStatus} feed={feed} loadFeed={loadFeed} sortFeed={sortFeed} unloadUser={unloadUser} />} />
              <Route path="/submit" element={<Submit user={user} loadFeed={loadFeed} />} />
              <Route path="/collaborate" element={<Feed showSort={true} feed={collabFeed} user={user} sortFeed={sortFeed} />} />
            </Routes>

            <Footer />
          </div>
        }
      </div>
    </Router>
  );
}

export default App;
