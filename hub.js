
const express = require('express');
const caf = require('./server-modules/configuration/config-access-facade');
const config = new caf(__dirname);
const tenancyRouter = require('./server-modules/tenant-router');
const authentictionRouter = require('./server-modules/login-router');
const securedExpress = require('./server-modules/secured-session-server');
const applicationRouter = require('./server-modules/application-router');
const tenancyCheck = require('./server-modules/tenancy-filter-middleware');
const staticResourcesRouter = express.static(config.constants.resourcesFolder);
const securedServer = new securedExpress(config.constants.cookieName, config.constants.cookieSecret, config.constants.sessionMaxTimeout, validateLogin);
const userLogin = new authentictionRouter(securedServer, config);
const tenancy = new tenancyRouter(config);

const debugRouter = express();
debugRouter.use(config.constants.hostingUrls.rootUrl, (req, res, next) => {
    console.log(req.sessionID + " " + req.path);
    next();
})

//Unsecured Router
securedServer.ungaurdedRoute(config.constants.hostingUrls.rootUrl, [debugRouter, userLogin.router, staticResourcesRouter]);

//Secured Application Router
securedServer.gaurdedRoute(config.constants.hostingUrls.applicationsUrl, [tenancyCheck, applicationRouter], config.constants.hostingUrls.notfoundUrl);

//Secured Tenants Router
securedServer.gaurdedRoute(config.constants.hostingUrls.tenantsUrl, [tenancyCheck, tenancy.router], config.constants.hostingUrls.notfoundUrl);//TODO: Do we need Tenant Filter Middleware here?

//Activate Server
securedServer.listen(config.constants.hostingPort, () => console.log(`App-Center active on port ${config.constants.hostingPort}!`));

function validateLogin(username, password, done) {
    //Failure Example
    //return done(null, false, { message: 'Not a valid email ' + username });
    //return done(null, false, { message: 'Password fails length validation [50,1] ' + username });

    //Sucess Example
    return done(null, { id: username });
}
