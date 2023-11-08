# WriteABadSong
A social Media website based around songwriting that encourages quantity over quality, and promotes collaboration.

# WORK LOG:
-   Started switching from Multer to Dropbox api so i can use the 
    ELEPHANTSQL database without running out of room.
-   I'll need to clean out the multer references, and update 
-   LOGIN.js
-   REGISTER.js
-   SUBMIT.js
-   I'm currently having trouble logging in. Registered users are getting stored in database


## current gameplan:
Created a **react app** to house the front-end components.
Seems to make sense since I will be reusing a lot of things around the app

Going to create a back-end using **Node.js & express**
Right now I'll just be testing it on a local server. Not sure where to host it yet.
Possibly on my website. I own the domain after all...

Using **Knex** and *PG* for database.

# Main features:
- Create a profile page
- Upload songs
- Remove your own songs
- Directly message and follow other users
- Get points for posting, voting, commenting, etc
- Win “prizes” or badges each month based on point system
- Scoreboard


## Sub features:
- Upload Profile Picture
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


