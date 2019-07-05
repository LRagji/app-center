const express = require('express');
const appRouter = express();

module.exports = class LoginRouter {
    constructor(securedServer, constants) {

        appRouter.get(constants.hostingUrls.loginPageUrl, (req, res) => res.sendFile(constants.loginPagePath));
        appRouter.post(constants.hostingUrls.loginPageUrl, [securedServer.authenticate(constants.hostingUrls.loginPageUrl), (req, res) => res.redirect(constants.hostingUrls.applicationsUrl)]);
        appRouter.post(constants.hostingUrls.logoutPageUrl, [(req, res) => {
            req.logout();
            req.session.destroy();
            res.redirect(constants.hostingUrls.loginPageUrl);
        }]);

        this.router = appRouter;
    }
}