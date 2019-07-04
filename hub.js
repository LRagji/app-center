
const express = require('express');
const port = process.env.PORT || 4000;
const path = require('path');
const cookieSecret = "retaliation"; //TODO:Move to secure store
const cookieName = "hub-db89960b1248";// This should be a unique ID else session will collapse with each other.
const sessionMaxTimeout = (100 * 10 * 1000); //16.xx minutes
const securedExpress = require('./server-modules/secured-session-server');
const proxyRouter = require('./server-modules/proxy-service');
const staticResourcesRouter = express.static(path.join(__dirname + '/server-modules/hosting-content/unsecured/'));

const securedServer = new securedExpress(cookieName, cookieSecret, sessionMaxTimeout,
    (username, password, done) => {
        //Failure Example
        //return done(null, false, { message: 'Not a valid email ' + username });
        //return done(null, false, { message: 'Password fails length validation [50,1] ' + username });

        //Sucess Example
        return done(null, { id: username });
    }
);

const debugRouter = express();
debugRouter.use('/', (req, res, next) => {
    console.log(req.sessionID + " " + req.path);
    next();
})

//Login Router
const userAuthenticationRouter = express();
userAuthenticationRouter.get('/login', (req, res) => res.sendFile(path.join(__dirname + '/login.html')));
userAuthenticationRouter.post('/login', [securedServer.authenticate('/login'), (req, res) => res.redirect('/apps/')]);
userAuthenticationRouter.post('/logout', [(req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/login');
}]);

//Unsecured Router
securedServer.ungaurdedRoute("/", [debugRouter,userAuthenticationRouter,staticResourcesRouter]);

//Secured Router
securedServer.gaurdedRoute("/apps/", proxyRouter, '/login');

securedServer.listen(port, () => console.log(`App-Center active on port ${port}!`));
