import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Views/Login/Login'
import Nav from './Components/Nav/Nav';
import Footer from './Components/Footer/Footer';
import Register from './Views/Register/Register';
import Profile from './Views/Profile/Profile';
import Feed from './Components/Feed/Feed';
import Submit from './Views/Submit/Submit';
import Collaborate from './Views/Collaborate/Collaborate';
import Editor from './Views/Editor/Editor';
import Scoreboard from './Views/Scoreboard/Scoreboard';

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
    collab: 'false',
    profile_background: ''
  })

  const [feed, setFeed] = useState([])
  const [collabFeed, setCollabFeed] = useState([])
  const [stars, setStars] = useState([])
  const [collabUsers, setCollabUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])


  useEffect(() => {

    const checkAuthentication = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/auth/check-session`, {
          credentials: 'include'
        })
        const data = await response.json()
        const currentUser = data.user
        loadUser(currentUser)
        // console.log(data)
      }
      catch (error) {
        console.error('Error checking authentication:', error);
      };
    };

    checkAuthentication();
    loadFeed();
    loadAllUsers();
    // eslint-disable-next-line
  }, []);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

  const loadAllUsers = async () => {
    const resp = await fetch(`${BACKEND_URL}/collab/get-all`)
    const data = await resp.json();
    setCollabUsers(data.collabUsers)
    setAllUsers(data.allUsers)
  }

  const loadFeed = async () => {
    const resp = await fetch(`${BACKEND_URL}/feed`)
    const data = await resp.json();
    setFeed(data.newFeed)
    setCollabFeed(data.filteredFeed)
  }

  const handleSetCollabFeed = (newFeed) => {
    setCollabFeed(prevFeed => [...newFeed])
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
    // console.log('sorted by ', method, ' on ', type)
  }

  const getStars = async (id) => {
    const resp = await fetch(`${BACKEND_URL}/get-stars?id=${id}`, {
      credentials: 'include'
    })
    const data = await resp.json();
    const nextStars = data.userStars.map(star => Number(star.post_id))
    setStars(nextStars)
  }
  const updateStars = async (user_id, post_id, currentSort, page) => {
    if (user.user_id > 0) {
      try {
        const resp = await fetch(`${BACKEND_URL}/update-stars?userId=${user_id}&postId=${post_id}`,
          {
            method: "put",
            credentials: 'include'
          })
        const data = await resp.json();
        if (data.message === 'starred') {
          setStars(prevStars => [...stars, data.post]);
        } else if (data.message === 'un-starred') {
          setStars(prevStars => stars.filter(star => star.feed_id !== data.post))
        }
        await loadFeed();
        await getStars(user_id);

      } catch (err) {
        console.error(`There b errors in ye star fetch... ${err}`)
      }
    } else { return }
  }

  const changeUserPic = (newPic) => {
    const nextUser = { ...user, user_profile_pic: newPic };
    setUser(nextUser);
  }

  const changeUserProfile = (newPic => {
    const nextUser = { ...user, profile_background: newPic }
    setUser(nextUser)
  })

  const changeUserStatus = (newStatus) => {
    const nextUser = { ...user, status: newStatus };
    setUser(nextUser);
  }

  const changeUserCollab = (newCollab) => {
    const nextUser = { ...user, collab: newCollab };
    setUser(nextUser);
  }

  const setCollabByUser = (username) => {
    const nextFeed = collabFeed.filter(post => post.username === username)
    setCollabFeed(nextFeed)
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
      collab: data.collab,
      profile_background: data.profile_background
    })
  }

  const unloadUser = () => {
    try {
      fetch(`${BACKEND_URL}/auth/signout`, {
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
        collab: false,
        profile_background: ''

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
              <Route path='/' element={<Feed getStars={getStars} stars={stars} updateStars={updateStars} showSort={true} feed={feed} user={user} loadFeed={loadFeed} sortFeed={sortFeed} />} />
              <Route path='score' element={<Scoreboard users={allUsers} />}/>
              <Route path="/login" element={<Login loadUser={loadUser} />} />
              <Route path="/register" element={<Register loadUser={loadUser} />} />
              <Route path="/profile" element={<Profile user={user} loadAllUsers={loadAllUsers} changeUserProfile={changeUserProfile} stars={stars} getStars={getStars} updateStars={updateStars} changeUserPic={changeUserPic} changeUserCollab={changeUserCollab} loadUser={loadUser} changeUserStatus={changeUserStatus} feed={feed} loadFeed={loadFeed} sortFeed={sortFeed} unloadUser={unloadUser} />} />
              <Route path="/submit" element={<Submit user={user} loadFeed={loadFeed} loadAllUsers={loadAllUsers}/>} />
              <Route path="/collaborate" element={<Collaborate handleSetCollabFeed={handleSetCollabFeed} collabUsers={collabUsers} setCollabByUser={setCollabByUser} stars={stars} getStars={getStars} updateStars={updateStars} collabFeed={collabFeed} user={user} sortFeed={sortFeed} />} />
              <Route path="/collaborate/editor" element={<Editor user={user} />} />
            </Routes>

            <Footer />
          </div>
        }
      </div>
    </Router>
  );
}

export default App;
