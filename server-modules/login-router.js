const express = require('express');
const appRouter = express();

module.exports = class LoginRouter {
    constructor(securedServer, config) {

        appRouter.get(config.constants.hostingUrls.loginPageUrl, (req, res) => {
            //res.
            res.sendFile(config.constants.loginPagePath)
        });//TODO: Infer Tenant from url. else push it to unknown page
        appRouter.post(config.constants.hostingUrls.loginPageUrl, [securedServer.authenticate(config.constants.hostingUrls.notfoundUrl), (req, res) => res.redirect(config.constants.hostingUrls.applicationsUrl)]);
        appRouter.post(config.constants.hostingUrls.logoutPageUrl, [(req, res) => {
            req.logout();
            req.session.destroy();
            res.redirect(config.constants.hostingUrls.rootUrl);
        }]);

        this.router = appRouter;
    }
}