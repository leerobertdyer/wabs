import { useEffect, useState } from 'react'
import './Notifications.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const Notifications = ({ useClick, token, socket, type, newNotes }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    if (newNotes && newNotes.length > 0 ) {
      setNotifications(newNotes)
    }
  }, [newNotes])

  useEffect(() => {
    console.log(notifications);
  }, [notifications])

  useEffect(() => {
    if (token) {
      if (socket){
        getNotifications();
      }
    }
    //eslint-disable-next-line
  }, [token, socket])

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on('getNotifications', async () => {
      console.log('got em');
      await getNotifications();
    })
    //eslint-disable-next-line
  }, [socket])

  const getNotifications = async () => {
    console.log(type);
    const resp = await fetch(`${BACKEND_URL}/profile/get-notifications`, {
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      }
    });
    if (resp.ok) {
      console.log(type, 'here');
      const data = await resp.json();
      if (data.notifications.length > 0) {
        let notes = data.notifications
        if (type === "message") {
          console.log(type);
          const filteredNotifications = notes.filter(n => n.type === "message");
          console.log(filteredNotifications);
          setNotifications(filteredNotifications);
        } else if (type === "collab") {
          console.log(type);
          const filteredNotifications = notes.filter(n => n.type === "collab");
          console.log(filteredNotifications);
          setNotifications(filteredNotifications)
        } else if (type === "all") { 
          console.log(notes);
          setNotifications(notes)
        }
      }
    }
  }

  return (<>
    {showNotifications ?
      <div className='notifactionsMenu' onClick={() => setShowNotifications(false)}>
        {notifications.length === 0
          ? <>
            <p className='notification'>Nothing new atm!</p>
          </>
          : notifications.map((note, idx) => {
            return <p className='notification'>{note.type}: {note.content}</p>
          })
        }
      </div>
      : notifications.length > 0 ? <div className='mainNotificationsDiv'
        onClick={useClick ? () => setShowNotifications(true) : null}>{notifications.length}</div> : null}

  </>)
}

export default Notifications