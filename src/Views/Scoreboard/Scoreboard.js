import './Scoreboard.css'
import ScoreFeed from '../../Components/ScoreFeed/ScoreFeed'

const Scoreboard = ({ users }) => {
    const sortedUsers = users.sort((a, b) => b.score - a.score)

    return (
        <div className='mainScoreBoardDiv'>
            <p className='center lgtxt'>Scoreboard</p>
            <ScoreFeed users={sortedUsers} />    

        </div>
    )
}

export default Scoreboard