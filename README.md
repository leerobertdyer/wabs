# WriteABadSong
A social Media website based around songwriting that encourages quantity over quality, and promotes collaboration.

Still very much in progress 

# BUGS:
-   If you register, but decline to authorize dbx, then there is nothing in place to stop you from submitting, it will end up with an error
        to solve it I'll need to implement a redirect to auth when a user without a token tries to submit,
        OR wrap the auth process in some kind of transaction....
- Also on REGISTER if username or email already taken, may still allow account creation but breaks app.
- Stars "fill in" when clicked on home page, but not on profile feeds...
- Submitting two collabs with the same name both will be deleted if one is finalized.
                Either prevent by making collab titles have unique names
                Or give use another method to del().
- Scoreboard displays winners even when everyone is at 0 points...
- Feed only updates for current user

# To Do:

-       Add Google/Facebook Sign in to firebase: https://console.firebase.google.com/u/0/project/wabs-e49c4/authentication/providers

-   comments on posts
-   DM messaging capability
-   noticications number and dropdown by username above login bar and in profile nav
-   notifications via email and/or text
-   follow other users (notifications for their posts at least, but maybe tie in dm with follow)

-   link user names to user profiles 
-   make profile pages dynamic

-   delete Collabs from profile (fullsongfeed)
-   make delete function actually delete from dbx
-   Add option to edit instead of delete.

-   Add first time marker in database to give TOUR of PROFILE options
-   Add/update bio
- add function to move background pic around

-   Win “prizes” or badges each month based on point system 
-   Badges for collaboraters/monthly winners/most active

- Allow multiple people to collab on a single song
- Show multiple versions of collab lyrics/titles/etc allow original poster to choose from them
- In COLLAB page if you click a user and they have no songs, post message linking to their profile

- build out a "previous months winners" page accesible from scoreboard that lists out previous months score and breaks down how points where made



