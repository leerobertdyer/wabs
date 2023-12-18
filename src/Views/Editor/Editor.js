import { CiEdit } from "react-icons/ci";
import './Editor.css'
import { useLocation } from "react-router-dom";

const Editor = () => {

  const { post } = useLocation().state;
  console.log(post);

  return (
    <>
      <div className='mainEditorDiv'>

        <div className="editDiv">
          <h1>"{post.title}"</h1>by {post.username}<h2></h2><CiEdit className="editIcon" size={50} />
        </div>

        <div className="editDiv lyricsDivInEditor">
          <p className="lyricsInEditor">
           {post.lyrics}
            </p>
            <CiEdit className="editIcon" size={50} />
        </div>

        <div className="editDiv">
          <label htmlFor="editorInputButton" className="editorInputButton">Audio File+
          <input type="file" style={{display: 'none'}} accept="mp3/m4a" id="editorInputButton"/>
          </label>
        </div>

      </div>
    </>
  )
}

export default Editor