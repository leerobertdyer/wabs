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

  const handleSubmitCollab = () => {
    console.log(title);
    console.log(lyrics);
  }
  return (
    <>
      <div className='mainEditorDiv'>
        {showPopup && <div className='mainPopupDiv'>
            <button className='littleX'>X</button>
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
              <span className="titleAndUser">
                {hasCollab
                  ? <>
                    <h1>"{title}"</h1><h2>by {post.username} & {user.userName}</h2>
                  </>
                  : <>
                    <h1>"{title}"</h1><h2>by {post.username}</h2>
                  </>
                }
              </span>
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
            <input type="file" style={{ display: 'none' }} accept="mp3/m4a" id="editorInputButton" />
          </label>
        }

        {hasCollab && <>
          <button onClick={() => handleSubmitCollab()} style={{width: '200px'}} className='editorInputButton'>Submit For Review</button>
        </>}
      </div>
    </>
  )
}

export default Editor