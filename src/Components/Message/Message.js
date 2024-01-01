import './Message.css'

// const BACKGROUND_URL = process.env.REACT_APP_BACKEND_URL;


const Message = ({ user, message, user1username, user2username }) => {
// console.log(user, message);
  return (
    <div className={message.user1_id === user.user_id ? 'eachMessage sentMessage' : 'eachMessage receivedMessage'}>
      <div className='nameAndMessage'>
      {/* <p className="messageSender">{message.user1_id === user.user_id ? user1username : user2username}: </p> */}
      <p className="messageContent">{message.content}</p>
      </div>
    </div>
  );
};

export default Message;