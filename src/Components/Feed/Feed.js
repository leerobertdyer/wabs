import { useState, useEffect } from "react";
import { LiaTrashAlt } from "react-icons/lia";
import Audio from "../Audio/Audio";
import './Feed.css'
import { useNavigate } from "react-router-dom";
import ProfileLink from "../ProfileLink/ProfileLink";

function Feed({ feed, collabFeed, user, loadFeed, getStars, updateStars, stars }) {
    const [currentPost, setCurrentPost] = useState({});
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showPhoto, setShowPhoto] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [showLyrics, setShowLyrics] = useState(false);


    const page = window.location.href
    const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
    const navigate = useNavigate();

    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScroll = () => {
        const position = window.scrollY;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (user.user_id) {
            getStars(user.user_id);
        }
        // eslint-disable-next-line
    }, [user])

    const starHollow = '../../../Assets/star.png'
    const starFilled = '../../../Assets/starFilled.png'

    const handleStarClick = async (post_id) => {
        page === `${FRONTEND_URL}/feed`
            ? await updateStars(user.user_id, post_id)
            : await updateStars(user.user_id, post_id)
    }

    const handleDeleteClick = (event, id, type, user_id) => {
        event.stopPropagation();
        const nextCurrentPost = { id: id, type: type, user_id: user_id }
        setCurrentPost(nextCurrentPost)
        setShowLyrics(false);
        setShowPhoto(false);
        setConfirmDelete(true);
    }

    const handleCollabClick = (post) => {
        user.username
            ? navigate(`/collaborate/editor`, { state: { post } })
            : navigate('/login')
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    const handleShowPhoto = (pic) => {
        setPhoto(pic);
        setShowPhoto(true)
    }

    const handleShowLyrics = (post) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        setCurrentPost(post)
        setShowLyrics(true);
    }



    const deletePost = async () => {
        console.log('Deleting Post ', currentPost.id)
        const resp = await fetch(`${BACKEND_URL}/delete-post?feed_id=${currentPost.id}&feed_type=${currentPost.type}&user_id=${currentPost.user_id}`, {
            method: "DELETE",
            credentials: 'include'
        })
        if (resp.ok) {
            loadFeed();
            setCurrentPost({ id: null, type: null, user_id: null })
            setConfirmDelete(false)
        }
    }

    const cardColors = {
        song: 'songFeedCard',
        collab: 'collabFeedCard',
        status: 'statusFeedCard',
        profile_pic: 'picFeedCard',
        music: 'musicFeedCard',
        lyrics: 'lyricFeedCard',
        default: 'defaultCard'
    };

    return (
        <>
            {showLyrics &&
                <div className="showPhotoDiv">
                    <div className="xBtnContainer">
                        <button onClick={() => setShowLyrics(false)} className="xBtn" style={{ marginTop: scrollPosition + 10 }} >X</button>
                    </div>
                    <div className="innerShowLyricDiv">
                        <pre className="innerShowLyricPre">
                            <h1 className="lyricTitle">{currentPost.title}</h1>
                            {currentPost.lyrics}
                        </pre>
                        <button className="collabButton" style={{ marginBottom: "-20px" }} onClick={() => (handleCollabClick(currentPost))}>Collaborate!</button>
                    </div>
                </div>}

            {showPhoto &&
                <div className="showPhotoDiv">
                    <div className="xBtnContainer">
                        <button onClick={() => setShowPhoto(false)} className="xBtn" style={{ marginTop: scrollPosition - 25 }} >X</button>
                    </div>
                    <div className="innerShowPhotoDiv" style={{ backgroundImage: `url(${photo})`, backgroundSize: 'contain', marginTop: scrollPosition + 30 }}>
                    </div>
                </div>}
            {confirmDelete &&
                <div className="loading">
                    <div className="deleteDialogBox" style={{ marginTop: scrollPosition + 200 }}>
                        Are you sure?
                        <p>(this can't be undone)</p>
                        <div className="deleteBtnDiv">
                            <button className="btn deleteBtn" onClick={() => deletePost()}>Delete</button>
                            <button className="btn" onClick={() => setConfirmDelete(false)}>Cancel</button>
                        </div>
                    </div>
                </div>}
            <div className="outerFeedDiv">

                <div className='allPosts'>
                    {feed.map((post, index) => {
                        const cardColor = cardColors[post.type] || cardColors['default']


                        return (
                            <div className={`postCard ${cardColor}`}
                                style={post.type === "profile_pic" || post.type === "profile_background"
                                    ? {
                                        backgroundImage: `url(${post.feed_pic})`,
                                        backgroundSize: "100vw"
                                    }
                                    : {}}
                                key={index}>

                                <div className="topPostDiv">
                                    <ProfileLink post={post} />

                                    {(post.type === "music" || post.type === "lyrics")
                                        && <div>
                                            <h3 className="postTitle">"{post.title}"</h3>
                                            <h4 style={{ textAlign: 'center', fontSize: '2vmax' }}>Looking for {post.type === "music" ? 'lyrics' : 'music'}</h4>
                                        </div>
                                    }
                                    {post.type === "song" &&
                                        <h3 className="postTitle"><span className="newSongPreTitle">New Song:</span>"{post.title}" by {post.username}</h3>}
                                    {post.type === "collab" &&
                                        <h3 className="postTitle"><span className="newSongPreTitle">New Collab:</span>"{post.title}" by {post.username} & {post.partner_username}</h3>}
                                    {post.type === "status"
                                        && <h2 >{`${post.username} says:`}</h2>}
                                    {post.type === "profile_pic" && <p className="postPicInfo">{post.username} updated their profile pic...</p>}
                                    {post.type === "profile_background" && <p className="postPicInfo">{post.username} updated their background pic...</p>}

                                    <div className="starsWrap">
                                        <div className="starsPicAndDigit">
                                            <img src={(stars.includes(post.feed_id))
                                                ? starFilled
                                                : starHollow}
                                                alt="star"
                                                className="starImg"
                                                onClick={() => handleStarClick(post.feed_id)}></img>
                                            <p>Stars: {post.stars}</p>
                                        </div>
                                    </div>


                                </div>
                                <div className={(post.type === "profile_pic" || post.type === "profile_background" || post.type === "lyrics")
                                    ? "bottomPostDiv clickMe" : "bottomPostDiv"}
                                    onClick={(post.type === "profile_pic" || post.type === "profile_background")
                                        ? () => { handleShowPhoto(post.feed_pic) }
                                        : post.type === "lyrics" ? (() => { handleShowLyrics(post) }) : null}>

                                    {(post.type === "song" || post.type === "music" || post.type === "collab") && <> <Audio className="feedAudio" source={post.song_file} /> <div></div> </>}

                                    {post.type === "lyrics"
                                        &&
                                        <pre className="lyricsFeed">{post.lyrics}</pre>}

                                    {post.type === "status" &&
                                        <>
                                            <h3 className='feedStatus'>{`"${post.feed_status}"`}</h3>
                                            {post.user_id !== user.user_id && <div></div>}
                                        </>
                                    }

                                    {(post.type === "music" || post.type === "lyrics") && post.user_id !== user.user_id
                                        && <button className="collabButton" onClick={() => (handleCollabClick(post))}>Collaborate!</button>
                                    }
                                </div>
                                {user.user_id === post.user_id && <div className="trash">
                                    <LiaTrashAlt size={40}
                                        onClick={(event) => handleDeleteClick(event, post.feed_id, post.type, user.user_id)} />
                                </div>}
                            </div>
                        )
                    }
                    )}
                </div>
            </div>
        </>
    )
}

export default Feed