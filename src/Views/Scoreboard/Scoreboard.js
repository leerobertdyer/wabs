import './Scoreboard.css'
import ScoreFeed from '../../Components/ScoreFeed/ScoreFeed'
import { useEffect } from 'react'

const Scoreboard = ({ users }) => {
    useEffect(() => {
        const setScores = async() => {
            const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/update-scores`)
            if (resp.ok) {
                const data = await resp.json();

            }
        }
    }, [])

    const sortedUsers = users.sort((a, b) => b.score - a.score)


    return (
        <div className='mainScoreBoardDiv'>
            <p className='center lgtxt'>Scoreboard</p>
            <ScoreFeed users={sortedUsers} />    

        </div>
    )
}

export default Scoreboard