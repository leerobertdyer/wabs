# WriteABadSong
A social Media website based around songwriting that encourages quantity over quality, and promotes collaboration.

Still very much in progress 

# BUGS:
-   If you register, but decline to authorize dbx, then there is nothing in place to stop you from submitting, it will end up with an error
        to solve it I'll need to implement a redirect to auth when a user without a token tries to submit,
        OR wrap the auth process in some kind of transaction....
- Stars "fill in" when clicked on home page, but not on profile feeds...
- Submitting two collabs with the same name both will be deleted if one is finalized.
                Either prevent by making collab titles have unique names
                Or give use another method to del().
-Scoreboard displays winners even when everyone is at 0 points...

# To Do:

-Password Confirm input 
   -Notification when failed.

-   Store each new months points in separate table
-   Win “prizes” or badges each month based on point system 
-   Badges for collaboraters/monthly winners/most active
-   comments on posts
-   DM messaging capability
-   notifications via email and/or text
-   noticications number and dropdown by username above login bar
-   link user names to user profiles make profile pages dynamic
-   make delete function actually delete form dbx
-   Do something with load time for new song submission... display a loading wheel at least...
-   follow other users 
-   Add/update bio
-   Add scroll effect on hover to show more lyrics on lyric feed....
-       delete Collabs from profile (fullsongfeed)
- Allow multiple people to collab on a single song
- Show multiple versions of collab lyrics/titles/etc allow original poster to choose from them
- add function to move background pic around



