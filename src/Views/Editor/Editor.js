import './Editor.css'
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Editor = ({ user }) => {
  const { post } = useLocation().state;
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [lyrics, setLyrics] = useState(post.lyrics)
  const [hasCollab, setHasCollab] = useState(false)
  const [showPopup, setShowPopup] = useState(true)
  const [notes, setNotes] = useState('')

  const handleTitleSubmit = (event) => {
    event.preventDefault();
    // console.log(title);
    //////    Store in new editor db table     ///////////
    setIsEditingTitle(false);
    setHasCollab(true)
  }

  const handleLyricChange = (newLyrics) => {
    setLyrics(newLyrics)
    setHasCollab(true)
  }

  const handleNotesChange = (event) => {
    setHasCollab(true)
    setNotes(event.target.value)
  }

  const handleSubmitCollab = () => {
    console.log(title);
    console.log(lyrics);
    console.log(notes);
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
          <br/>
          <div className='editInstructions'>
          <p>Click any section to edit. <br/> 
          When you're done editing, make sure to "submit for review". <br/>
          {post.username} can send any notes they may have. <br/>
          And when you are both happy <br/>
          {post.username} can submit the song and you'll both get points!</p>
          </div>
            </div>
          </div>}
        {isEditingTitle
          ? <>
            <form className="editDiv">
              <div className='innerEditDiv'>
                <input type='text' defaultValue={title} className="editDivInput" onChange={(event) => setTitle(event.target.value)} />
                <input type='submit' onClick={(event) => handleTitleSubmit(event)} className="editSubmitBtn" />
              </div>
            </form>
          </>

          : <>
            <div className="editDiv" onClick={() => setIsEditingTitle(true)}>
              
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

        {(post.type === "lyrics" || post.type === "music") &&
           <form className='editDiv'>
            <div className='innerEditDiv'>
              <textarea defaultValue={lyrics} className="editorTextArea" onChange={(event) => handleLyricChange(event.target.value)} />
            </div>
          </form>
        }

        {post.type === "lyrics" &&
          <label htmlFor="editorInputButton" className="editorInputButton" >Audio File+
            <input type="file" style={{ display: 'none' }} onChange={() => setHasCollab(true)}accept="mp3/m4a" id="editorInputButton" />
          </label>
        }
        <textarea className='anyMoreNotes' 
        placeholder={`Any notes for ${post.username}?`}
        onChange={(event) => handleNotesChange(event)}/>

        {hasCollab && <>
          <button onClick={() => handleSubmitCollab()} style={{width: '200px'}} className='editorInputButton'>Submit For Review</button>
        </>}
      </div>
    </>
  )
}

export default Editor