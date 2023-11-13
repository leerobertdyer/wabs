import React from 'react';

const Access = async (props) => {
    const [user, title, lyrics, song_file] = this.props

    const accessToken = await new Promise((resolve, reject) => {
        const timeout = 60000;
        const start = Date.now();
        const checkParams = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('accessToken');
            if (token) {
                resolve(token);
            } else if (Date.now() - start < timeout) {
                console.log(window.location.href)
                setTimeout(checkParams, 500);
            } else {
                reject(new Error('Timeout: Access token not received.'));
            }
        };

        checkParams();
    });
    console.log('token found: ', accessToken)

    console.log('Received form data:', { title, lyrics, song_file, user });
    const formData = new FormData();
    formData.append('title', title);
    formData.append('lyrics', lyrics)
    formData.append('user_id', user.user_id)
    formData.append('song_file', song_file);
    console.log('FormData Appended: ', formData)
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
    return (
        <div>
            Accessing...
        </div>

    )

}
export default Access;
