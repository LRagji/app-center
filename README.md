# App-Center
A simple application host, to serve multiple apps as a combined application.

#### Reasons to use App-Center:

1. When you have a large application in a multi-team enviroment with different release schedules.
2. Containerize apps with respect to their responsibilities but deploy them as one whole ptoduct to final customer.
3. Offload Login, Logout, Session management, User Preferences,Error handling, Notifications and Profiles.
4. Abstraction from other apps at the same time enabling deep linking or context based navigations between apps.
5. Multi varitey app strategy supported MPA to SPA, and multi language support.
6. Supported on Chrome, Firefox, Safari can be supported % of userbase.
7. Session tracking and linking requests together for security and auditing purposes.

## Steps to onbard an app:
1. Register you app name(each app in the app center is uniquely identified with name.)
2. Move all the linked resources to `/apps/{yourAppName}`
    1. For MPA you need to manually change all references to resources to above mentioned path.
    2. For SPA with angular please use following build flags `ng build --prod --deploy-url /apps/{yourAppName}/`

⚡️ Your App is ready to be viewwed in APP-Center ⚡️


## Tested with
1. Lit-Elements MPA
2. Angular SPA

## Known Issues:
1. You may see login screen within a logged in session this is cause of the session timeout problem, I am actively working on it.
2. The app is non polished one day worth of work.(Test,Session Management,User Logins,UX needs to be completed.)
3. Context based navigation or Data transfer between apps is currently achived with either `window.parent` or `postmessages`

<!-- ## Feature's
1. Complete abstraction at client side -->

## Idea's
1. Use redis cache for session storage.
2. Try using session to route requests to right app depending on the user selection.
3. csurf package for XSRF attacks
4. Add helmet for security 
5. rate-limiter-flexible for rate limiting
6. Back & Forward Navigations
7. Error Handling
8. Multi Browser Support Chrome, Firefox
9. Use service worker for login and logout detection.
10. Use service worker for application url redirections. 


This branch contains code for service worker experiment for folowing reasons
1. Can service worker be used for onboarding an application without making them go through any changes?
    Yes but it is not recommended cause 
    1. Service workers are in draft specs even though they are supported by all major browsers(Tested with Chrome,Firefox).
    2. Resusing same route will collapse URL concept, which means multiple resources will share the same URL which may cause collision of caching the response.
2. Can service workers be used for detecting a sesssion timeout?



