function validateLogin(username, password, done) {
    //Failure Example
    //return done(null, false, { message: 'Not a valid email ' + username });
    //return done(null, false, { message: 'Password fails length validation [50,1] ' + username });

    //Sucess Example
    return done(null, { id: username });
}

const express = require('express');
const server = express();
const configLoader = require("./server-modules/configuration/config-access-facade");
const config = new configLoader(__dirname);
const tenant = require('./server-modules/tenant-application')
const staticResourcesRouter = express.static(config.constants.resourcesFolder);


function sessionLogger(name) {
    return (req, res, next) => {
        console.log(name + " " + req.sessionID + " " + req.path);
        next();
    };
}

server.use('/', sessionLogger(""));

//Setup resources
server.use("/resources/", staticResourcesRouter);

//Setup tenants & applications
config.tenants().forEach((tenantInfo) => {
    let currentTenantUrl = config.constants.hostingUrls.tenantsUrl + tenantInfo.name + config.constants.urlSeperator;
    const currentTenant = new tenant(tenantInfo, validateLogin, config.constants.appcenterPagePath, currentTenantUrl);
    server.use(currentTenantUrl, currentTenant.Application);
});

server.listen(config.constants.hostingPort, () => console.log(`App-Center active on port ${config.constants.hostingPort}!`));