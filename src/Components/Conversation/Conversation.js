import './Conversation.css'
import { useState, useEffect, useRef } from 'react';
import Message from '../Message/Message';

const Conversations = ({ socket, user, user1username, user2username, user2_id, conversation_id, filteredMessages }) => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [showConversation, setShowConversation] = useState(false);
    const conversationRef = useRef(null);

    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        if (filteredMessages && filteredMessages.length > 0) {
            setMessages(filteredMessages)
                 if (conversationRef.current) {
                console.log(conversationRef.current);
                console.log('Before scrolling:', conversationRef.current.scrollTop);
                console.log(conversationRef.current.scrollHeight);
                conversationRef.current.scrollTop = 500;
                console.log('After scrolling:', conversationRef.current.scrollTop);
            }
        }
        
    }, [filteredMessages])

   

    useEffect(() => {
        const handleNewMessage = (message) => {

            setMessages(prevMessages => [...prevMessages, message]);
        };

        socket.on('message', handleNewMessage);

        return () => {
            socket.off('message', handleNewMessage);
        };
    }, [socket]);


    const sendMessage = async (event) => {
        event.preventDefault();
        window.scrollTo({
            top: 50,
            behavior: 'smooth'
        })
        if (messageText.length === 0) { return }
        const messageId = generateUniqueId();
        setShowConversation(true)
        const saveMessage = async () => {
            const resp = await fetch(`${BACKEND_URL}/messages/new-message`, {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    id: messageId,
                    content: messageText,
                    user1_id: user.user_id,
                    user2_id: user2_id,
                    conversation_id: conversation_id
                })
            });
            if (resp.ok) {
                //
            }
        }
        await saveMessage();
        socket.emit('sendMessage', { id: messageId, content: messageText, user2: user2_id });
    
        setMessageText('');
    };

    const generateUniqueId = () => {
        return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    };

    return (
        <>
            {/* <div   className={showConversation ? 'mainConversationDiv showConversation' : 'mainConversationDiv'}> */}
                <div className='convoTitleAndInput'>
                    <h1 className='convoTitle'>{user1username} & {user2username}</h1>
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
                <div ref={conversationRef} className="conversation">

                    {filteredMessages && filteredMessages.length > 0
                        ? messages.map((message, index) => (
                            <Message key={index} message={message} user={user} user1username={user1username} user2username={user2username}
                                className={message.user1_id === user.user_id ? 'sentMessage' : 'received message'} />))
                        : null}

                </div>
            {/* </div> */}
            {messages.length > 0 && <button
                className='btn showConvoBtn'
                onClick={() => setShowConversation(!showConversation)}>
                {showConversation ? 'Close' : 'Show'}</button>}
        </>
    )
}

export default Conversations