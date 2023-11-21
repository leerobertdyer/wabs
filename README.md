# WriteABadSong
A social Media website based around songwriting that encourages quantity over quality, and promotes collaboration.

Still very much in development ;)

# BUGS:
-   in songRoutes.js I have completely bungled the submit handler..... working on authentication still of course...

-   If you register, but decline to authorize dbx, then there is nothing in place to stop you from submitting, it will end up with an error
        to solve it I'll need to implement a redirect to auth when a user without a token tries to submit

# WORK LOG:
To Do:
    -Use the links from the dbx files to update the song player and feed the home page with a scrollable element.
    -I need my homepage to be a feed that displays the most current "posts"
        -A 'post' can be a song, a status change, a lyrics looking for song, a song looking for lyrics, a new user signed up, a profile pic change.
            -I'll need a new bridge table that collects each new submission and ties it to user id.
            -Not sure how I deal with a new registration, maybe add the username to the bridge table
            -Display bridge table on home feed...


# Main features:
- Create a profile page
- Upload songs

    TO DO:
- Remove your own songs 
- Directly message and follow other users 
- Get points for posting, voting, commenting, etc 
- Win “prizes” or badges each month based on point system 
- Scoreboard 


## Sub features:
- Upload Profile Picture

    TO DO:
- Add/update bio 
- Make Posts to a central feed
- Make comments on songs 
- Create a music player that sorts all songs by:
    - Votes (most popular/least popular(if tied sort by most recent)
    - Date (most recent/least recent)
    - Produced/unproduced
- Collaborate with others:
    - Post songs in need of lyrics
    - Post lyrics in need of songs


