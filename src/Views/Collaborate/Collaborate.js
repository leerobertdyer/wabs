import { useState } from 'react'
import { HashLink } from 'react-router-hash-link';
import Feed from '../../Components/Feed/Feed'
import { MdMoreHoriz } from "react-icons/md";
import './Collaborate.css'
const Collaborate = ({ stars, collabUsers, handleSetCollabFeed, setCollabByUser, getStars, updateStars, collabFeed, user, sortFeed }) => {
const [showAll, setShowAll] = useState(false);
const [oldCollab, setOldCollab] = useState([])
const [showClearFilter, setShowClearFilter] = useState(false)
const [currentSelectedUser, setCurrentSelectedUser] = useState(null)

    const filteredUsers = collabUsers.filter(person => person.username !== user.userName)


const displayCollaborators = showAll
    ? filteredUsers
    : filteredUsers.slice(0, 3)

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
            {filteredUsers.length > 0 && !currentSelectedUser
            && (<>
            {displayCollaborators.map((user, key) => {
                return <HashLink smooth to="/collaborate#collabFeedMarker"  key={key} className='collabUsername'onClick={() => handleSetCollabByUser(user.username)}>{user.username}</HashLink>
            })}
            {filteredUsers.length > 3 &&
            <div className="clickDotsDiv" onClick={() => setShowAll(!showAll)}>
            <MdMoreHoriz size={30} className='clickDots'/>
            </div>
            }
            </>)}
            {filteredUsers.length === 0 && <p>No users currently collaborating... :(</p>}
            
        </div>
        <div className='collabFeedDiv' id="collabFeedMarker">
    <Feed  getStars={getStars} stars={stars} updateStars={updateStars} showSort={true} collabFeed={collabFeed} feed={collabFeed} user={user} sortFeed={sortFeed} />
        </div>
    </div>
    </>

  )
}

export default Collaborate