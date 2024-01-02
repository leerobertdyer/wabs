import './Message.css'

const Message = ({ user, message }) => {

  return (
    <>
    <div className={message.user1_id === user.user_id ? 'eachMessage sentMessage' : 'eachMessage receivedMessage'}>
      <div className='nameAndMessage'>
      <p className="messageContent">{message.content}</p>
      </div>
    </div>
    </>
  );
};

export default Message;