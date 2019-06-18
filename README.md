# App-Center
A simple application host, to serve multiple apps as a combined application.

#### Reasons to use App-Center:

1. When you have a large application in a multi-team enviroment with different release schedules.
2. Containerize apps with respect to their responsibilities but deploy them as one whole ptoduct to final customer.
3. Offload Login, Logout, Session management, User Preferences and Profiles.
4. Abstraction from other apps at the same time enabling deep linking or context based navigations between apps.
5. Multi varitey app strategy supported MPA to SPA, and multi language support.

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