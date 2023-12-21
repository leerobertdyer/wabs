import './Editor.css'
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Editor = ({ user }) => {
  const { post } = useLocation().state;
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingLyrics, setIsEditingLyrics] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [lyrics, setLyrics] = useState(post.lyrics)
  const [hasCollab, setHasCollab] = useState(false)

  const handleTitleSubmit = (event) => {
    event.preventDefault();
    // console.log(title);
    //////    Store in new editor db table     ///////////
    setIsEditingTitle(false);
    setHasCollab(true)
  }

  const handleLyricSubmit = (event) => {
    event.preventDefault();
    // console.log(lyrics);
    //////    Store in new editor db table     ///////////
    setIsEditingLyrics(false);
    setHasCollab(true)
  }

  return (
    <>
      <div className='mainEditorDiv'>
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

        {post.type === "lyrics" &&
          isEditingLyrics
          ? <form className='editDiv'>
            <div className='innerEditDiv'>
              <textarea defaultValue={lyrics} className="editDivInput editDivTextArea" onChange={(event) => setLyrics(event.target.value)} />
              <input type='submit' onClick={(event) => handleLyricSubmit(event)} className="editSubmitBtn" />
            </div>
          </form>
          : <div className="editDiv lyricsDivInEditor" onClick={() => setIsEditingLyrics(true)}>
            <p className="lyricsInEditor">
              {post.lyrics}
            </p>
          </div>
        }

        {post.type === "music" &&
          <label htmlFor="editorInputButton" className="editorInputButton" >Audio File+
            <input type="file" style={{ display: 'none' }} accept="mp3/m4a" id="editorInputButton" />
          </label>
        }

      </div>
    </>
  )
}

export default Editor