import { useState } from 'react'
import { Link } from 'react-router-dom'
import Feed from '../../Components/Feed/Feed'
import { MdMoreHoriz } from "react-icons/md";
import './Collaborate.css'
const Collaborate = ({ feed, stars, collabUsers, getStars, updateStars, collabFeed, user, sortFeed }) => {
const [showAll, setShowAll] = useState(false);
const displayCollaborators = showAll
    ? collabUsers
    : collabUsers.slice(0, 3)


  return (
    <>
    <div className='mainCollabDiv'>
        <div className='listOfCollaborators'>
            <h1 className='collaboratorsTitle'>Collab with:</h1>
            {collabUsers.length > 0
            ?(<>
            {displayCollaborators.map((user, key) => {
                return <Link to="/profile" key={key} className='collabUsername'>{user.username}</Link>
            })}
            <div className="clickDotsDiv" onClick={() => setShowAll(!showAll)}>
            <MdMoreHoriz size={30} className='clickDots'/>
            </div>
            </>)
            :<p>No users currently collaborating... :(</p>
            }
        </div>
        <div className='collabFeedDiv'>
    <Feed getStars={getStars} stars={stars} updateStars={updateStars} showSort={true} collabFeed={collabFeed} feed={collabFeed} user={user} sortFeed={sortFeed} />
        </div>
    </div>
    </>

  )
}

export default Collaborate