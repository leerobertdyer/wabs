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
  const [stars, setStars] = useState([])
  const apiEndpoint = process.env.REACT_APP_SERVER_URL
  console.log(apiEndpoint)
  useEffect(() => {

    const checkAuthentication = async () => {
      try {
        const response = await fetch('http://localhost:4000/auth/check-session', {
          credentials: 'include'
        })
        const data = await response.json()
        const currentUser = data.user
        loadUser(currentUser)
        console.log('client side cookie: ', document.cookie)
        console.log(data)
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
    console.log('sorted by ', method, ' on ', type)
  }

  const getStars = async (id) => {
    const resp = await fetch(`http://localhost:4000/get-stars?id=${id}`, {
        credentials: 'include'
    })
    const data = await resp.json();
    const nextStars = data.userStars.map(star => Number(star.post_id))
    setStars(nextStars)
}
const updateStars = async (user_id, post_id, currentSort, page) => {
    if (user.user_id > 0) {
        try {
            const resp = await fetch(`http://localhost:4000/update-stars?userId=${user_id}&postId=${post_id}`,
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

            console.log('Stars after setStars:', stars); // Log the stars state

            await loadFeed();

            console.log('Feed after loadFeed:', feed); // Log the feed state

            await getStars(user_id);

            console.log('Stars after getStars:', stars); // Log the stars state again
          } catch (err) {
            console.error(`There b errors in ye star fetch... ${err}`)
        }
    } else { return }
}

  const changeUserPic = (newPic) => {
    const nextUser = { ...user, user_profile_pic: newPic };
    setUser(nextUser);
  }

  const changeUserStatus = (newStatus) => {
    const nextUser = { ...user, status: newStatus };
    setUser(nextUser);
  }

  const changeUserCollab = (newCollab) => {
    const nextUser = {...user, collab: newCollab};
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
              <Route path='/' element={<Feed getStars={getStars} stars={stars} updateStars={updateStars} showSort={true} feed={feed} user={user} loadFeed={loadFeed} sortFeed={sortFeed} />} />
              <Route path="/login" element={<Login loadUser={loadUser} />} />
              <Route path="/register" element={<Register loadUser={loadUser} />} />
              <Route path="/profile" element={<Profile user={user} stars={stars} getStars={getStars} updateStars={updateStars} changeUserPic={changeUserPic} changeUserCollab={changeUserCollab} loadUser={loadUser} changeUserStatus={changeUserStatus} feed={feed} loadFeed={loadFeed} sortFeed={sortFeed} unloadUser={unloadUser} />} />
              <Route path="/submit" element={<Submit user={user} loadFeed={loadFeed} />} />
              <Route path="/collaborate" element={<Feed getStars={getStars} stars={stars} updateStars={updateStars} showSort={true} feed={collabFeed} user={user} sortFeed={sortFeed} />} />
            </Routes>

            <Footer />
          </div>
        }
      </div>
    </Router>
  );
}

export default App;
