import React, { useEffect } from 'react';

const Access = (props) => {
  const { user, song } = props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await new Promise((resolve, reject) => {
          const timeout = 60000;
          const start = Date.now();
          const checkParams = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('accessToken');
            if (token) {
              console.log(token);
              resolve(token);
            } else if (Date.now() - start < timeout) {
              console.log(window.location.href);
              setTimeout(checkParams, 500);
            } else {
              reject(new Error('Timeout: Access token not received.'));
            }
          };

          checkParams();
        });

        console.log('token found:', accessToken);

        console.log('Received form data:', { song, user });
        const formData = new FormData();
        formData.append('title', song.title);
        formData.append('lyrics', song.lyrics);
        formData.append('song_file', song.song_file);
        formData.append('user_id', user.user_id);
        console.log('FormData Appended:', formData.values);

        const submitResponse = await fetch('http://localhost:4000/submit', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: formData,
        });

        if (submitResponse.ok) {
          const submitData = await submitResponse.json();
          console.log('Song submission successful:', submitData);
        } else {
          const errorText = await submitResponse.text();
          console.error('Failed to submit song. Server response:', submitResponse.status, errorText);
        }
      } catch (error) {
        console.error('Error during song submission:', error);
      }
    };

    fetchData();
  }, [song, user]); 

  return (
    <div>
      Accessing...
    </div>
  );
};

export default Access;
