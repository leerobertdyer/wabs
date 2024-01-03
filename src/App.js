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
import Home from './Views/Home/Home';
import { auth } from './firebase';
import io from 'socket.io-client';


const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

function App() {

  const [user, setUser] = useState({
    user_id: '',
    username: '',
    email: '',
    isLoggedIn: false,
    user_profile_pic: '',
    status: '',
    score: 0,
    datecreated: '',
    collab: 'false',
    profile_background: '',
    sortfeed: ''
  })

  const [feed, setFeed] = useState([])
  const [collabFeed, setCollabFeed] = useState([])
  const [stars, setStars] = useState([])
  const [collabUsers, setCollabUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [token, setToken] = useState('')
  const [socket, setSocket] = useState(null)
  const [allMessages, setAllMessages] = useState([])
  const [conversations, setConversations] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [collabNotes, setCollabNotes] = useState([]);
  const [messageNotes, setMessageNotes] = useState([]);

  useEffect(() => {

    const checkAuthentication = async () => {
      try {
        const firebaseToken = await auth.currentUser.getIdToken();
        setToken(firebaseToken)
        const response = await fetch(`${BACKEND_URL}/auth/check-session`, {
          headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${firebaseToken}`,
          },
        });
        const data = await response.json();
        loadUser(data.user);

        setSocket(io(BACKEND_URL, {
          transports: ['websocket'],
          query: {
            userId: user.user_id
          },
        }))
      }
      catch (error) {
        console.error('Error checking authentication:', error);
      };
    };
    auth.onAuthStateChanged((user) => {
      if (user) {
        // console.log(user);
        checkAuthentication();
      }
    })
    loadAllUsers();
    loadFeed();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on('connect', async () => {
      console.log(`${user.username} connected`);
      socket.emit('sendUserId', user.user_id)
      await getConversations();
    });

    socket.on('updateFeed', async () => {
      await loadFeed();
    })

    socket.on('getConversations', async () => {
      await getConversations();
    })

    socket.on('getNotifications', async () => {
      await getNotifications();
    })

    socket.on('disconnect', () => {
      console.log('Client Disconnected');
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
    //eslint-disable-next-line
  }, [socket, user.user_id, user.username])

  useEffect(() => {
    const checker = async () => {
      if (token) {
        if (socket) {
          await getNotifications();
        }
      }
    }
    checker();
    //eslint-disable-next-line
  }, [token, socket])

  const getNotifications = async () => {
    const resp = await fetch(`${BACKEND_URL}/profile/get-notifications`, {
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.notifications.length > 0) {
        const nextAllNotes = data.notifications
        setAllNotes(nextAllNotes);
        const nextMessageNotes = data.notifications.filter(n => n.type === "message");
        setMessageNotes(nextMessageNotes);
        const nextCollabNotes = data.notifications.filter(n => n.type === "collab");
        setCollabNotes(nextCollabNotes);
        return [data.notifications]
      }
      else { return [] }
    }
  }

  const handleSetNotes = async (newNotes, type) => {
    if (type === "collab") {
      setCollabNotes(newNotes)
    }
    else if (type === "message") {
      setMessageNotes(newNotes)
    }
    const data = await getNotifications();
    setAllNotes(data)
  }

  const getConversations = async () => {
    const resp = await fetch(`${BACKEND_URL}/messages/get-conversations`, {
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    });
    if (resp.ok) {
      const data = await resp.json();
      setConversations(prev => data.conversations)
      setAllMessages(prev => data.messages)
    }
  }

  const loadAllUsers = async () => {
    const resp = await fetch(`${BACKEND_URL}/collab/get-all`)
    const data = await resp.json();
    setCollabUsers(data.collabUsers)
    setAllUsers(data.allUsers)
  }


  const loadFeed = async () => {
    const resp = await fetch(`${BACKEND_URL}/feed`)
    const data = await resp.json();
    let method = 'Latest'
    if (user.sortfeed) {
      method = user.sortfeed
    }
    sortFeed(method, data.newFeed, 'home')
    sortFeed(method, data.filteredFeed, 'collab')
  }

  const handleSetCollabFeed = (newFeed) => {
    setCollabFeed(prevFeed => [...newFeed])
  }

  const sortFeed = async (method, currentFeed, type) => {
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
    if (user.user_id) {
      const resp = await fetch(`${BACKEND_URL}/update-sortfeed`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          sortfeed: method
        })
      });
      if (resp.ok) {
        if (user.sortfeed !== method) {
          const nextUser = { ...user, sortfeed: method };
          setUser(nextUser)
        }
    }
    }

    if (type === 'home') {
      setFeed(nextFeed)
    } else if (type === 'collab') {
      setCollabFeed(nextFeed)
    } 
    console.log(user.username, 'sorted by ', method, ' on ', type)
  }

  const getStars = async (id) => {
    const resp = await fetch(`${BACKEND_URL}/get-stars?id=${id}`, {
      credentials: 'include'
    })
    const data = await resp.json();
    const nextStars = data.userStars.map(star => Number(star.post_id))
    setStars(nextStars)
  }

  const updateStars = async (user_id, post_id) => {
    if (user.user_id > 0) {
      try {
        const resp = await fetch(`${BACKEND_URL}/update-stars?userId=${user_id}&postId=${post_id}`,
          {
            method: "put",
            credentials: 'include'
          })
        const data = await resp.json();
        if (data.message === 'starred') {
          setStars(data.post);
        } else if (data.message === 'un-starred') {
          const nextStars = stars.filter(star => star.feed_id !== data.post)
          setStars(nextStars);
        }

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
      username: data.username,
      email: data.user_email,
      datecreated: data.date_user_joined,
      score: data.score,
      isLoggedIn: true,
      user_profile_pic: data.user_profile_pic,
      status: data.user_status,
      collab: data.collab,
      profile_background: data.profile_background,
      sortfeed: data.sortfeed
    })
  }

  const unloadUser = () => {
    setUser({
      user_id: '',
      username: '',
      email: '',
      isLoggedIn: false,
      user_profile_pic: '',
      score: 0,
      datecreated: '',
      collab: false,
      profile_background: '',
      sortfeed: ''
    })
  }




  return (
    <Router>
      <div className='App'>
        {
          <div id='mainWrapper'>
            <Nav user={user} unloadUser={unloadUser} token={token} socket={socket} notes={allNotes} />
            <div className='spacing'></div>
            <Routes>
              <Route path='/' element={<Home user={user} />} />
              <Route path='/feed' element={<Feed getStars={getStars} stars={stars} updateStars={updateStars} showSort={true} feed={feed} user={user} loadFeed={loadFeed} sortFeed={sortFeed} />} />
              <Route path='score' element={<Scoreboard users={allUsers} />} />
              <Route path="/login" element={<Login loadUser={loadUser} />} />
              <Route path="/register" element={<Register loadUser={loadUser} />} />
              <Route path="/profile" element={<Profile handleSetNotes={handleSetNotes} messageNotes={messageNotes} collabNotes={collabNotes} user={user} token={token} allMessages={allMessages} conversations={conversations} socket={socket} allUsers={allUsers} loadAllUsers={loadAllUsers} changeUserProfile={changeUserProfile} stars={stars} getStars={getStars} updateStars={updateStars} changeUserPic={changeUserPic} changeUserCollab={changeUserCollab} loadUser={loadUser} changeUserStatus={changeUserStatus} feed={feed} loadFeed={loadFeed} sortFeed={sortFeed} unloadUser={unloadUser} />} />
              <Route path="/submit" element={<Submit user={user} loadFeed={loadFeed} loadAllUsers={loadAllUsers} />} />
              <Route path="/collaborate" element={<Collaborate handleSetCollabFeed={handleSetCollabFeed} collabUsers={collabUsers} setCollabByUser={setCollabByUser} stars={stars} getStars={getStars} updateStars={updateStars} collabFeed={collabFeed} user={user} sortFeed={sortFeed} />} />
              <Route path="/collaborate/editor" element={<Editor user={user} token={token} />} />
            </Routes>

            <Footer />
          </div>
        }
      </div>
    </Router>
  );
}

export default App;
