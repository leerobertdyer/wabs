import { useState } from 'react';
import './Messages.css'

const Messages = ({ feed, user, handleRefreshMessages }) => {
    const [isResponding, setIsResponding] = useState(false);
    const [currentNote, setCurrentNote] = useState(null);
    const [response, setResponse] = useState('')
    const [allMessages, setAllMessages] = useState(feed)

    const BACKGROUND_URL = process.env.REACT_APP_BACKEND_URL;

    const handleRespondClick = async (note) => {
        setCurrentNote(note)
        setIsResponding(true)
    }

    const handleResponse = async (note) => {
        if (response.length < 1) {
            return
        }

        const resp = await fetch(`${BACKGROUND_URL}/profile/respond`, {
            method: "PUT",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                user_id: user.user_id,
                note: note,
                response: response
            })
        });
        if (resp.ok) {
            console.log('worked, now update messages');
        }
    }
 
    const handleDeleteNote = async (note) => {
        const resp = await fetch(`${BACKGROUND_URL}/profile/delete-message`, {
            method: "DELETE",
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                user_id: user.user_id,
                note: note
            })
        });
        if (resp.ok) {
            const nextMessages = feed.filter(item => {
                return item.message_id !== note.message_id;
            })
            handleRefreshMessages(nextMessages)
        }
    }

    return (
        <>
            <div className="mainMessageDiv">
                {isResponding
                   ? <div className="eachMessage">
                        <p className='messageSender'>From: {currentNote.sender}</p>
                        <pre className='messageContent center '>"{currentNote.content}"</pre>
                        <div className='messageBtnDiv'>
                            <button className="deleteMessageBtn" onClick={() => setIsResponding(false)}>Cancel</button>
                            <button className="respondMessageBtn" onClick={() => handleResponse(currentNote)}>Send</button>
                        </div>
                    </div>
                    : <>
                        <h1>Your Messages</h1>
                        {allMessages.map((note, key) => {
                            return (
                                <div key={key} className="eachMessage">
                                    <p className='messageSender'>From: {note.sender}</p>
                                    <pre className='messageContent center '>"{note.content}"</pre>
                                    <div className='messageBtnDiv'>
                                        <button className="deleteMessageBtn" onClick={() => handleDeleteNote(note)}>Delete</button>
                                        <button className="respondMessageBtn" onClick={() => handleRespondClick(note)}>Respond</button>
                                    </div>
                                </div>
                            )
                        })
                        }

                    </>
                }
            </div>
        </>

    )
}

export default Messages