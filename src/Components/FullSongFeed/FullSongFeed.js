import Audio from "../Audio/Audio"
import './FullSongFeed.css'
import { useNavigate } from "react-router-dom"


const FullSongFeed = ({ feed, user }) => {
const navigate = useNavigate();

const handleCollabClick = (post) => {
    user && user.userName
    ? navigate(`/collaborate/editor`, {state: { post }})
    : navigate('/login')
}

    return (
<>
<div className="fullSongFeedMainDiv">
{feed.map((post, key) => {
        return (
            <div key={key} className="fullSongFeedDiv center flexCol gap">
                <h1 className='fullSongFeedTitle'>"{post.title}"</h1>
                {post.music && <div className="fullSongFeedAudio">
                    <Audio source={post.music} />
                    </div>}
                <pre className='fullSongFeedLyrics center '>{post.lyrics}</pre>
                <button className="collabButton center" onClick={() => (handleCollabClick(post))}>Collaborate!</button>
            </div>
        )
    })
}
</div>
</>

    )
}

export default FullSongFeed