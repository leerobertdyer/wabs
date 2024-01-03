import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

import './Notifications.css'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Notifications = ({ useClick, notes }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();


  return (<>
    {showNotifications ?
      <div className='notifactionsMenu' onClick={() => setShowNotifications(false)}>
        {notes && notes.length === 0
          ? <>
            <p className='notification'>Nothing new atm!</p>
          </>
          : notes.map((note, idx) => {
            return <p key={idx} className='notification'
            onClick={() => navigate('/profile')}>{note.type}: {note.content}</p>
          })
        }
      </div>
      : notes && notes.length > 0 ? <div className='mainNotificationsDiv'
        onClick={useClick ? () => setShowNotifications(true) : null}>{notes.length}</div> : null}
  </>)
}

export default Notifications