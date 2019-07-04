const passport = require('passport');
const strategy = require('passport-local').Strategy;
const ensureLogin = require('connect-ensure-login');
const express = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const bodyParser = require('body-parser');


module.exports = class SecuredSessionServer {
    constructor(cookieName, cookieSecret, sessionMaxTimeout, signIn) {
        this.gaurdedRoute = this.gaurdedRoute.bind(this);
        this.ungaurdedRoute = this.ungaurdedRoute.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.listen = this.listen.bind(this);
        this._intExpress = this._intExpress.bind(this);

        this._app = this._intExpress(cookieName, cookieSecret, sessionMaxTimeout);

        passport.use(new strategy(signIn));

        passport.serializeUser(function (user, cb) {
            //TODO:Send only userid, else encrypt the contents.
            cb(null, JSON.stringify(user));
        });

        passport.deserializeUser(function (stringUser, cb) {
            //TODO:receive only userid, else decrypt the contents.
            cb(null, JSON.parse(stringUser));
        });
    }

    _intExpress(cookieName, cookieSecret, sessionMaxTimeout) {
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
        app.use(passport.initialize());
        app.use(passport.session());
        return app
    }

    gaurdedRoute(path, expressHandler, failureRedirect) {
        return this._app.use(path, [ensureLogin.ensureLoggedIn(failureRedirect), expressHandler]);
    }

    ungaurdedRoute(path, expressHandler) {
        return this._app.use(path, expressHandler);
    }

    authenticate(failureRedirect) {
        return passport.authenticate('local', { failureRedirect: failureRedirect });
    }

    listen(port, callback) {
        this._app.listen(port, callback);
    }
}