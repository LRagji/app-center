const express = require('express');
const appRouter = express();
const path = require('path');

module.exports = class LoginRouter {
    constructor(securedServer) {

        appRouter.get('/login', (req, res) => res.sendFile(path.join(__dirname + '/hosting-content/unsecured/login/login.html')));
        appRouter.post('/login', [securedServer.authenticate('/login'), (req, res) => res.redirect('/apps/')]);
        appRouter.post('/logout', [(req, res) => {
            req.logout();
            req.session.destroy();
            res.redirect('/login');
        }]);

        this.router = appRouter;
    }
}