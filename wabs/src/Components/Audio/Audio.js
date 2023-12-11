import Plyr from 'plyr';
import 'plyr/dist/plyr.css'; 
import './Audio.css'
import { useRef, useEffect } from 'react';

const Audio = ({ source }) => {
    const player = useRef(null);
  
    useEffect(() => {
        console.log(source)
      player.current = new Plyr('.js-plyr', { controls: ['play', 'progress', 'current-time', 'mute', 'volume'] });
    }, []);
  
    return (
        <>
      <div className='audioContainer'>
        <audio className="js-plyr" controls>
          <source src={source} type="audio/mp3" />
        </audio>
      </div>
      </>
    );
  };

  export default Audio
  