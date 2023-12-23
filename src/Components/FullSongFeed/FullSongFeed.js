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
            <div key={key} className="fullSongFeedDiv center flexCol">
                <h1 className='fullSongFeedTitle'>"{post.title}"</h1>
                {post.music && <div className="fullSongFeedAudio">
                    <Audio source={post.music} />
                    </div>}
                <pre className='fullSongFeedLyrics center '>{post.lyrics}</pre>
                <button className="collabButton center collabBtnFullSongFeed" onClick={() => handleCollabClick(post)}>Collaborate!</button>
                {
                    user.user_id === post.user_id &&
                    <button className="finalizeBtn center" onClick={() => handleCollabClick(post)}>Finalize</button>
                }
            </div>
        )
    })
}
</div>
</>

    )
}

export default FullSongFeed