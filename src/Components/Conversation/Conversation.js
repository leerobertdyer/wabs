import './Conversation.css'
import { useState, useEffect } from 'react';
import Message from '../Message/Message';

const Conversations = ({ socket, user, user2, conversation_id, allMessages }) => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [showConversation, setShowConversation] = useState(false);
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    
    useEffect(() => {
        if (allMessages && allMessages.length > 0 ) {
        console.log(allMessages);
        setMessages(allMessages)
        }
    }, [allMessages])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });
    }, [messages, socket]);

    const sendMessage = async(event) => {
        event.preventDefault();
        if (messageText.length === 0) { return }
        const messageId = generateUniqueId();
        const saveMessage = async() => {
            const resp = await fetch(`${BACKEND_URL}/messages/new-message`, {
                method: "POST",
                headers: {'content-type': 'application/json'},
                body: JSON.stringify({
                    id: messageId,
                    content: messageText,
                    user1_id: user.user_id,
                    user2_id: user2,
                    conversation_id: conversation_id
                })
            });
            if (resp.ok) {
                const data = await resp.json();
                console.log(data);
            }
        }
        await saveMessage();
        socket.emit('sendMessage', { id: messageId, content: messageText, user2 });
        setMessageText('');
    };

    const generateUniqueId = () => {
        return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    };

    return (
        <>
            <div className={showConversation ? "conversation showConversation" : "conversation"}>
                {messages.map((message, index) => (
                    <>
                    <h1 className='convoTitle'>{message.receiver} and {message.sender}</h1>
                        <Message key={index} message={message} user={user}  
                        className={message.user1_id === user.user_id ? 'sentMessage' : 'received message'} />
                    </> ))
                   }
                <form className="input-box">
                    <input
                        className='messageInput'
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Chat away..."
                    />
                    <input type="submit" className="messageBtn" value="send" onClick={(event) => sendMessage(event)}></input>
                </form>
            </div>
                   <button className='btn showConvoBtn' onClick={() => setShowConversation(true)}>Show</button>
    </>
  )
}

export default Conversations