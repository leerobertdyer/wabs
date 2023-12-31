import './ScoreFeed.css'

const ScoreFeed = ({ users }) => {
    return (
<>
<div className="scoreFeedMainDiv">
{users.map((user, key) => {
        let userClass = 'scoreFeedDiv'
        if (key === 0 && user.score > 0){
            userClass += ' firstPlaceBackground'
        } else if (key === 1 && user.score > 0) {
            userClass += ' secondPlaceBackground'
        } else if (key === 2 && user.score > 0) {
            userClass += ' thirdPlaceBackground'
        }
        return (
            <div key={key} className={userClass}>
                {key === 0 && user.score > 0
                ? <>
                <h1 className='scoreFeedTitle'>{user.username.toUpperCase()}</h1>
                <p className='firstPlace'>First Place!</p>
                </>  
                : key === 1 && user.score > 0
                ?<>
                <h1 className='scoreFeedTitle'>{user.username.toUpperCase()}</h1>
                <p className='secondPlace'>Second Place!</p>
                </>  
                : key === 2 && user.score > 0
                ? <>
                 <h1 className='scoreFeedTitle'>{user.username.toUpperCase()}</h1>
                 <p className='thirdPlace'>Third Place!</p>
                 </>  
                : <h1 className='scoreFeedTitle'>{user.username.toUpperCase()}</h1>
                }
                <h2 className="score">{user.score}</h2>
            </div>
        )
    })
}
</div>
</>

    )
}

export default ScoreFeed