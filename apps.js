const express = require('express');
const appRouter = express();
const proxy = require('express-request-proxy');
const path = require('path');

//App Routing
appRouter.use('/app1/*', (req, res, next) => {  //TODO:Example App1
    proxy({
        'url': 'http://139.59.89.208/'
    })(req, res, next)
});

appRouter.use('/app2/*', (req, res, next) => {  //TODO: Example App2
    proxy({
        'url': 'https://lragji.github.io/'
    })(req, res, next)
});

appRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/hub.html'));
});

module.exports = appRouter;