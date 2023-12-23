import './Editor.css'
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Editor = ({ user }) => {
  const { post } = useLocation().state;

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [lyrics, setLyrics] = useState(post.lyrics)
  const [music, setMusic] = useState(post.music_id)
  const [notes, setNotes] = useState('')
  const [hasCollab, setHasCollab] = useState(false)
  const [showPopup, setShowPopup] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showFail, setShowFail] = useState(false)

  const navigate = useNavigate();

  const handleTitleSubmit = (event) => {
    event.preventDefault();
    setIsEditingTitle(false);
    if (title !== post.title) {
      setHasCollab(true)
    } else if (title === post.title) {
      setHasCollab(false)
    }
  }

  const handleLyricChange = (newLyrics) => {
    setLyrics(newLyrics)
    if (newLyrics !== post.lyrics) {
      setHasCollab(true)
    } else if (newLyrics === post.lyrics) {
      setHasCollab(false)
    }
  }

  const handleNotesChange = (event) => {
    setHasCollab(true)
    setNotes(event.target.value)
  }

  const handleMusicChange = async (event) => {
    const newMusic = event.target.files[0]
    const formData = new FormData();
    formData.append('music', newMusic)
    const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/collab/submit-collab-music`, {
      method: "PUT",
      body: formData,
      credentials: 'include'
    })
    if (resp.ok) {
      const data = await resp.json();
      setHasCollab(true)
      setMusic(data.newMusic)
    }
  }

  const handleClearButton = (event) => {
    event.preventDefault();
    setLyrics(post.lyrics)
    if (post.title === title && post.music_id === music) {
      setHasCollab(false)
    }
  }

  const handleSubmitCollab = async () => {
    const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/collab/submit-collab-for-review`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'partner_id': user.user_id,
        'user_id': post.user_id,
        'title': title,
        'lyrics': lyrics,
        'music': music,
        'notes': notes,
        'feed_id': post.feed_id
      }),
      credentials: 'include'
    })
    if (resp.ok) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      const data = await resp.json();
      console.log(data);
      setShowSuccess(true)
    } else { setShowFail(true) }
    // fetch to new server route that stores any differences in database and notify original poster
  }

  return (
    <>
      <div className='mainEditorDiv'>
        {showPopup && <div className='mainPopupDiv'>
          <button className='littleX' onClick={() => setShowPopup(false)}>X</button>
          <div className='innerPopupDiv'>
            <h3 className='welcomeToTheEditor'>Welcome to the editor!</h3>
            <p>Let's work on <span className='username'>{post.username}'s</span> "{post.title}"</p>
            <br />
            <div className='editInstructions'>
              <p>Click any section to edit. <br /><br />
                When you're done editing, make sure to "submit for review". <br />
                When you are both happy <br />
                {post.username} can submit the song and you'll both get points!</p>
            </div>
          </div>
        </div>}
        {isEditingTitle
          ? <>
            <form>
              <div className='innerEditDiv '>
                <input type='text' defaultValue={title} className="editDivInput" onChange={(event) => setTitle(event.target.value)} />
                <input type='submit' value="Submit Title" onClick={(event) => handleTitleSubmit(event)} className="editSubmitBtn" />
              </div>
            </form>
          </>

: <>
            <div className="innerEditDiv titleDiv" onClick={() => setIsEditingTitle(true)}>

              {hasCollab
                ? <>
                  <h1>"{title}"</h1><h2>by {post.username} & {user.userName}</h2>
                </>
                : <>
                  <h1>"{title}"</h1><h2>by {post.username}</h2>
                </>
              }

            </div>
          </>
        }

        {post.type === "lyrics" &&<>
        <div className='musicInputDiv'>
          <p className='isLookingFor'>{post.username} needs music for their song: </p>
          <label htmlFor="editorInputButton" className="editorInputButton" >+Audio File
            <input type="file" style={{ display: 'none' }} onChange={(event) => handleMusicChange(event)} accept="mp3/m4a" id="editorInputButton" />
          </label>
        </div>
        </>
        }

        {(post.type === "lyrics" || post.type === "music") &&
          <form className='editDiv'>
            <div className='innerEditDiv'>
              <legend className='editorLegend'>Lyrics:</legend>
              <textarea value={lyrics} className="editorTextArea" onChange={(event) => handleLyricChange(event.target.value)} />
            </div>
        {hasCollab && <button className='editorInputButton clearBtn' onClick={(event) => handleClearButton(event)}>Clear</button>}
          </form>
        }

        <textarea className='anyMoreNotes'
          placeholder={`Any notes for ${post.username}?`}
          onChange={(event) => handleNotesChange(event)} />

        {hasCollab && <>
          <button onClick={() => handleSubmitCollab()} style={{ width: '200px' }} className='editorInputButton'>Submit For Review</button>
        </>}
        {showSuccess && <>
          <div className='successDiv'>
          <button className='littleX' onClick={() => navigate('/profile')}>X</button>
            Collab Under Way!
            <p className='afterSuccessMessage'>{post.username} will get a chance to review your work.<br/>
            When they are happy they can then submit the song</p>
          </div>
        </>}
        {showFail && <>
          <div className='failDiv'>
            Collab Failed...
          </div>
        </>}
      </div>
    </>
  )
}

export default Editor