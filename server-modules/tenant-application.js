const passport = require('passport');
const strategy = require('passport-local').Strategy;
const ensureLogin = require('connect-ensure-login');
const express = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const proxy = require('express-request-proxy');
const jwt = require('jsonwebtoken');
const cache = require('memory-cache');

//TODO: Change Auth startegy using auth type of the tenant info object


module.exports = class tenantApplication {
    constructor(tenantInfo, validateLogin, appcenterPagePath, mountUrl) {

        this._createApplication = this._createApplication.bind(this);
        this._addAuthentication = this._addAuthentication.bind(this);
        this._hostHomePage = this._hostHomePage.bind(this);
        this._hostLoginRoute = this._hostLoginRoute.bind(this);
        this._hostLogoutRoute = this._hostLogoutRoute.bind(this);
        this._hostAppCenterRoute = this._hostAppCenterRoute.bind(this);
        this._validateTenant = this._validateTenant.bind(this);
        this._hostProxyApplicationRoute = this._hostProxyApplicationRoute.bind(this);
        this._generateHeaders = this._generateHeaders.bind(this);

        //URL Constants
        this._homePageUrl = mountUrl;
        this._loginUrl = this._homePageUrl + "login/";
        this._appUrl = this._homePageUrl + "apps/";

        console.log("");
        console.log("Routes for:" + this._homePageUrl);
        let sessionName = tenantInfo.name + shortid.generate();
        let app = this._createApplication(sessionName, tenantInfo.sessionSecret, tenantInfo.sessionTimeout);
        app = this._addAuthentication(app, validateLogin);
        app = this._hostHomePage(app, tenantInfo.homePagePath);
        app = this._hostLoginRoute(app, tenantInfo.authentication.LoginPagePath, tenantInfo.tenantId);
        app = this._hostLogoutRoute(app);
        app = this._hostAppCenterRoute(app, appcenterPagePath, tenantInfo.tenantId);
        app = this._hostProxyApplicationRoute(app, tenantInfo.applications, tenantInfo.tenantId);

        this.Application = app;
    }

    _addAuthentication(app, validateLogin) {
        passport.use(new strategy(validateLogin));

        passport.serializeUser(function (user, cb) {
            //TODO:Send only userid, else encrypt the contents.
            cb(null, JSON.stringify(user));
        });

        passport.deserializeUser(function (stringUser, cb) {
            //TODO:receive only userid, else decrypt the contents.
            cb(null, JSON.parse(stringUser));
        });

        app.use(passport.initialize());
        app.use(passport.session());

        return app;
    }

    _createApplication(cookieName, cookieSecret, sessionMaxTimeout) {
        const app = express();
        app.use(cookieParser(cookieSecret));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(session({
            name: cookieName,
            secret: cookieSecret,
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false, maxAge: sessionMaxTimeout }
        }))

        return app
    }

    _hostHomePage(app, homePagePath) {
        console.log("   /" + " ---> " + homePagePath);
        app.get("/", (req, res) => res.sendFile(homePagePath));
        return app;
    }

    _hostLoginRoute(app, loginPagePath, tenantId) {
        console.log("   /login/" + " ---> " + loginPagePath);
        app.get('/login/', (req, res) => { res.sendFile(loginPagePath) })

        app.post('/login/', [passport.authenticate('local', { failureRedirect: this._loginUrl }), (req, res) => {
            req.session.tenantId = tenantId;
            res.redirect(this._appUrl);
        }]);
        return app;
    }

    _hostLogoutRoute(app) {
        console.log("   /logout/" + " ---> logout and redirect to "+this._homePageUrl);
        app.post("/logout/", [(req, res) => {
            req.logout();
            req.session.destroy();
            res.redirect(this._homePageUrl);
        }]);
        return app;
    }

    _hostAppCenterRoute(app, appcenterPagePath, tenantId) {
        console.log("   /apps/*" + " ---> " + appcenterPagePath);
        app.get("/apps/*", ensureLogin.ensureLoggedIn(this._loginUrl), this._validateTenant(tenantId), (req, res) => res.sendFile(appcenterPagePath));
        return app;
    }


    _hostProxyApplicationRoute(expressApp, applications, tenantId) {
        applications.forEach(appInfo => {
            const applicationUrl = "/proxy/" + appInfo.name + "/*";
            expressApp.use(applicationUrl, ensureLogin.ensureLoggedIn(this._loginUrl), this._validateTenant(tenantId), (req, res, next) => {
                proxy({
                    'url': appInfo.url + "*",
                    "headers": this._generateHeaders(req.user.id, tenantId), //TODO: This will depend on tenant auth info we are just mocking this for now.
                })(req, res, next)
            });
            console.log("   " + applicationUrl + " ---> " + appInfo.url);
        });
        return expressApp;
    }

    _generateHeaders(username, tenantId) {
        let cacheKey = username + tenantId;
        let token = cache.get(cacheKey);
        if (token == undefined) {
            token = jwt.sign({ "username": username, "tenant": tenantId }, 'shhhhh');
            cache.put(cacheKey, token, (1000 * 60));
        }
        return {
            "Authorization": token,
            "tenant": tenantId
        }
    }

    _validateTenant(tenantId) {
        return (req, res, next) => {
            if (req.session.tenantId === tenantId) {
                next();
            }
            else {
                console.warn("Cross Tenant: Session with " + req.session.tenantId + "requested access to " + tenantId);
                res.redirect(this._loginUrl);
            }
        };
    }
}