import React, {useState} from 'react';
import './Submit.css'

function Submit(props){

return (
    <div id="mainSubmitDiv"
    className='black'>
        <form>
        <label htmlFor="songTitle"
        className='clickMe black'>Title</label>
            <input type="text"
            id="songTitle"
            name="Title"
            placeholder='Song Title'
             />
            <label htmlFor="lyrics"
            className='clickMe black'>Lyrics</label>
            <textarea name="lyrics" id="lyrics" 
            cols="30" rows="10"
            placeholder='I wrote me a song.... it had some words.... and now it exits...'></textarea>
            <label htmlFor="songFile"
            className='clickMe black smallFormButton center'>Song+</label>
            <input type="file"
            id="songFile"
            name="songFile"
            accept="audio/*"
            style={{display: 'none'}} />
        </form>

    </div>
)

}

export default Submit