import Plyr from 'plyr';
import 'plyr/dist/plyr.css'; 
import './Audio.css'
import { useRef, useEffect } from 'react';

const Audio = ({ source }) => {
    const player = useRef(null);
  
    useEffect(() => {
      if (player.current) {
           new Plyr(player.current, { controls: ['play', 'progress', 'current-time', 'mute', 'volume'] });
      }
    }, [source]);
  
    return (
        <>
      <div className='audioContainer'>
        <audio className="js-plyr" controls ref={(el) => (player.current = el)}>
          <source src={source} type="audio/mp3" />
        </audio>
      </div>
      </>
    );
  };

  export default Audio
  