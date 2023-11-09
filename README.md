# WriteABadSong
A social Media website based around songwriting that encourages quantity over quality, and promotes collaboration.

Still very much in development ;)

## DROPBOX API:
MAIN ISSUE: my token expires every four hours, I'll need to update how I authorize the app...
https://www.dropbox.com/developers/documentation/http/documentation#oauth2-authorize - DPX API DOCUMENTATION

when using links in html element, remember to change 
https://www.dropbox.com to https://dl.dropboxusercontent.com

# WORK LOG:
-   vague success on getting the upload to run without errors,
but still not seeing the files show up in my dropbox///
-   and when i finally figure that out still need to figure out how to access them...
-   Started working with dropbox api so I can use 
    ELEPHANTSQL database without running out of room.
-   I'll need to clean out the multer references, and update 
-   LOGIN.js
-   REGISTER.js
-   SUBMIT.js
-  Registered users are getting stored in database, but login doesn't work
- Submit doesn't work either
- can't login to test the profile pic update either. Pretty much broke my app lol
-   BUT! I did solve the db problem where I kept spending an hour every time i switched computers...


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


