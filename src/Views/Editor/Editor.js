import './Editor.css'
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import ReactLoading from 'react-loading';

const Editor = ({ user, token }) => {
  const { post, final } = useLocation().state;

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [lyrics, setLyrics] = useState(post.lyrics || '')
  const [music, setMusic] = useState(post.music_id)
  const [notes, setNotes] = useState('')
  const [hasCollab, setHasCollab] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showFail, setShowFail] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMusic(prevMusic => post.music)
  }, [post])

  const handleTitleSubmit = (event) => {
    event.preventDefault();
    setIsEditingTitle(false);
    if (title !== post.title) {
      user.user_id !== post.user_id &&
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
    setIsLoading(true)
    const newMusic = event.target.files[0]
    const formData = new FormData();
    formData.append('music', newMusic)
    formData.append('user_id', user.user_id)
    const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/collab/submit-collab-music`, {
      method: "PUT",
      body: formData,
    })
    if (resp.ok) {
      setIsLoading(false)
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
    setIsLoading(true)
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

    })
    if (resp.ok) {
      setIsLoading(false)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      const data = await resp.json();
      console.log(data);
      setShowSuccess(true)
    } else { setShowFail(true) }
    //    *****  notify original poster  *****  //
  }

  const handleFinalizeClick = async () => {
      try {
        setIsLoading(true)
        const resp = await fetch(`${process.env.REACT_APP_BACKEND_URL}/collab/finalize`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'title': title,
            'user_id': user.user_id,
            'partner_id': post.partner_id,
            'lyrics': lyrics,
            'song_file': music,
            'votes': 0
          })
        })
        if (resp.ok) {
          setIsLoading(false)
          navigate('/')
          const data = await resp.json();
          console.log(data);
        }
      } catch (err) {
        console.error(`Error inserting new final collab song: `)
      }
  }

  return (
    <>
    {isLoading && <div className='loading'>
                <ReactLoading type={'spinningBubbles'} color={'orange'} height={'20%'} width={'20%'} />
                </div>}
      <div className='mainEditorDiv'>
        {final && <button className='finalizeBtn editorFinalBtn'
          onClick={() => handleFinalizeClick()}>Finalize!</button>}
        {isEditingTitle
          ? <>
            <form>
              <div className='innerEditDiv '>
                <legend className='editorLegend'>Title</legend>
                <input type='text' defaultValue={title} className="editDivInput" onChange={(event) => setTitle(event.target.value)} />
                <input type='submit' value="Submit Title" onClick={(event) => handleTitleSubmit(event)} className="editSubmitBtn" />
              </div>
            </form>
          </>

          : <>
            <legend className='editorLegend'>Title</legend>
            <div className="innerEditDiv titleDiv" onClick={() => setIsEditingTitle(true)}>

              {hasCollab
                ? <>
                 <span className='titleAndIcon'><h1>"{title}"</h1><FaRegEdit size={30}/></span><h2>by {post.username} & {user.username}</h2>
                </>
                : <>
                  <span className='titleAndIcon'><h1>"{title}"</h1><FaRegEdit size={30}/></span><h2>by {post.username}</h2>
                </>
              }

            </div>
          </>
        }


          <div className='musicInputDiv'>
            {post.type === "lyrics"
            ? <p className='isLookingFor'>{post.username} needs music for their song: </p>
            :  <p className='isLookingFor'>{post.username} already has music for their song, <br/>
            But feel free to offer yours: </p>
           }
            <label htmlFor="editorInputButton" className="editorInputButton" >+Audio File
              <input type="file" style={{ display: 'none' }} onChange={(event) => handleMusicChange(event)} accept="mp3/m4a" id="editorInputButton" />
            </label>
          </div>


        {(post.type === "lyrics" || post.type === "music") &&
          <>
            <legend className='editorLegend'>Lyrics</legend>
              <textarea value={lyrics} placeholder='Add lyrics here...' className="lyricTextEditor paper" onChange={(event) => handleLyricChange(event.target.value)} />

              {hasCollab && <button className='editorInputButton clearBtn' onClick={(event) => handleClearButton(event)}>Revert Lyrics</button>}

          </>

        }
    {user.user_id !== post.user_id &&
        <textarea className='anyMoreNotes paper'
          placeholder={`Any notes for ${post.username}?`}
          onChange={(event) => handleNotesChange(event)} />
    }

        {hasCollab && <>
          <button onClick={() => handleSubmitCollab()} style={{ width: '200px' }} className='editorInputButton'>Submit For Review</button>
        </>}
        {showSuccess && <>
          <div className='successDiv'>
            <button className='littleX' onClick={() => navigate('/profile')}>X</button>
            Collab Under Way!
            <p className='afterSuccessMessage'>{post.username} will get a chance to review your work.<br />
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