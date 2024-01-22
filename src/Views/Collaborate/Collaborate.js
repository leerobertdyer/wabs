import { useState } from 'react'
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import Feed from '../../Components/Feed/Feed'
import { MdMoreHoriz } from "react-icons/md";
import './Collaborate.css'
const Collaborate = ({ stars, handleSetCollabFeed, setCollabByUser, collabUsers, getStars, updateStars, collabFeed, user }) => {
const [showAll, setShowAll] = useState(false);
const [oldCollab, setOldCollab] = useState([])
const [showClearFilter, setShowClearFilter] = useState(false)
const [currentSelectedUser, setCurrentSelectedUser] = useState(null)


const handleSetCollabByUser = (username) => {
    setOldCollab(prevFeed => [...collabFeed])
    setCurrentSelectedUser(username)
    setShowClearFilter(true)
    setCollabByUser(username)
}

const handleClear = () => {
    setCurrentSelectedUser(null)
    setShowClearFilter(false)
    handleSetCollabFeed(oldCollab)
}

  return (
    <>
    <div className='mainCollabDiv'>
        <div className='listOfCollaborators'>
            <h1 className='collaboratorsTitle'>Collab with:</h1>
            {showClearFilter
            && <>
            <p className='collabUsername'>{currentSelectedUser}</p>
            <p className="clearCollab" onClick={() => handleClear()}>Clear</p>
            </>}
            {collabUsers.length > 0 && !currentSelectedUser
            && (<>
            {showAll
            ? collabUsers.map((user, key) => {
                return <HashLink smooth to="/collaborate#collabFeedMarker"  key={key} className='collabUsername'onClick={() => handleSetCollabByUser(user)}>{user}</HashLink>
            }) :
            collabUsers.slice(0, 3).map((user, key) => {
                return <HashLink smooth to="/collaborate#collabFeedMarker" key={key} className="collabUsername" onClick={() => handleSetCollabByUser(user)}>{user}</HashLink>
            })}
            {collabUsers.length > 3 &&
            <div className="clickDotsDiv" onClick={() => setShowAll(!showAll)}>
            <MdMoreHoriz size={30} className='clickDots'/>
            </div>
            }
            </>)}
            {collabUsers.length === 0 && <p>No users currently collaborating... :(</p>}
            
        </div>
        <h3 className='orSubmitYourOwn'>Or <Link to="/submit" className='btn collabSubmitLink'>Submit</Link> your own!</h3>
        <div className='collabFeedDiv' id="collabFeedMarker">
    <Feed  getStars={getStars} stars={stars} updateStars={updateStars} collabFeed={collabFeed} feed={collabFeed} user={user}  />
        </div>
    </div>
    </>

  )
}

export default Collaborate