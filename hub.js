const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const path = require('path');
const cookieSecret = "retaliation"; //TODO:Move to secure store
const cookieName = "hub-db89960b1248";// This should be a unique ID else session will collapse with each other.
const cookieParser = require('cookie-parser')
const session = require('express-session');
const sessionMaxTimeout = (100 * 10 * 1000); //16.xx minutes
const passport = require('passport');
const strategy = require('passport-local').Strategy;
const ensureLogin = require('connect-ensure-login');


app.use(cookieParser(cookieSecret));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(session({
    name: cookieName,
    secret: cookieSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: sessionMaxTimeout }
}))

app.use('/', (req, res, next) => {
    console.log(req.sessionID + " " + req.path);
    next();
})

passport.use(new strategy((username, password, done) => {
    //Failure Example
    //return done(null, false, { message: 'Not a valid email ' + username });
    //return done(null, false, { message: 'Password fails length validation [50,1] ' + username });

    //Sucess Example
    return done(null, { id: username });
}));

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


//Secure Router
app.use('/apps/', [ensureLogin.ensureLoggedIn('/login'), require('./apps')]);


//Login Router
app.get('/login', (req, res) => res.sendFile(path.join(__dirname + '/login.html')));
app.post('/login', [passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => res.redirect('/apps/')]);
app.post('/logout', [(req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/login');
}]);



app.listen(port, () => console.log(`Spartans Hub active on port ${port}!`))