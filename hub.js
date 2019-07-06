
const express = require('express');
const configConstants = require('./server-modules/config-constants');
const constants = new configConstants('', __dirname);
const authentictionRouter = require('./server-modules/login-router');
const securedExpress = require('./server-modules/secured-session-server');
const proxyRouter = require('./server-modules/proxy-router');
const staticResourcesRouter = express.static(constants.resourcesFolder);
const securedServer = new securedExpress(constants.cookieName, constants.cookieSecret, constants.sessionMaxTimeout, validateLogin);
const userLogin = new authentictionRouter(securedServer,constants);

const debugRouter = express();
debugRouter.use(constants.hostingUrls.rootUrl, (req, res, next) => {
    console.log(req.sessionID + " " + req.path);
    next();
})

//Unsecured Router
securedServer.ungaurdedRoute(constants.hostingUrls.rootUrl, [debugRouter, userLogin.router, staticResourcesRouter]);

//Secured Router
securedServer.gaurdedRoute(constants.hostingUrls.applicationsUrl, proxyRouter, constants.hostingUrls.notfoundUrl);

//Activate Server
securedServer.listen(constants.hostingPort, () => console.log(`App-Center active on port ${constants.hostingPort}!`));

function validateLogin(username, password, done) {
    //Failure Example
    //return done(null, false, { message: 'Not a valid email ' + username });
    //return done(null, false, { message: 'Password fails length validation [50,1] ' + username });

    //Sucess Example
    return done(null, { id: username });
}
