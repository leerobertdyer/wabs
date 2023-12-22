# WriteABadSong
A social Media website based around songwriting that encourages quantity over quality, and promotes collaboration.

Still very much in progress 

# BUGS:
-   If you register, but decline to authorize dbx, then there is nothing in place to stop you from submitting, it will end up with an error
        to solve it I'll need to implement a redirect to auth when a user without a token tries to submit,
        OR wrap the auth process in some kind of transaction....

# To Do:
        -Editor Page:
                -Add input to leave notes to each other
                -Add finalize button 
                    -once both users click finalize the new song will be posted as a SPECIAL collab bonus pts

-   I need to start implementing a points system, and pages to display the current monthly winner...
-   Badges for collaboraters/monthly winners/most active
-   comments on posts
-   DM messaging capability
-   notifications via email and/or text
-   noticications number and dropdown by username above login bar
-   link user names to user profiles make profile pages dynamic
-   make delete function actually delete form dbx
-   Do something with load time for new song submission... display a loading wheel at least...
-   follow other users 
-   Win “prizes” or badges each month based on point system 
-   Scoreboard page
-   Add/update bio
-   Add scroll effect on hover to show more lyrics on lyric feed....




