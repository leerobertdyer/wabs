import Audio from "../Audio/Audio"
import './FullSongFeed.css'
import { useNavigate } from "react-router-dom"


const FullSongFeed = ({ feed, user }) => {
const navigate = useNavigate();

const handleCollabClick = (post) => {
    user.userName
    ? navigate(`/collaborate/editor`, {state: { post }})
    : navigate('/login')
}

    return (
<>
{feed.map((post, key) => {
        return (
            <div key={key} className="fullSongFeedMainDiv flexCol">
                <h1 className='fullSongFeedTitle'>"{post.title}"</h1>
                {post.music && <Audio src={post.music}/>}
                <pre className='fullSongFeedLyrics center '>{post.lyrics}</pre>
                <button className="collabButton center" onClick={() => (handleCollabClick(post))}>Collaborate!</button>
            </div>
        )
    })
}
</>

    )
}

export default FullSongFeed