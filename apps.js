const express = require('express');
const appRouter = express();
const proxy = require('express-request-proxy');
const path = require('path');
const jwt = require('jsonwebtoken');
var cache = require('memory-cache');


//App Routing
appRouter.use('/app1/*', (req, res, next) => {  //TODO:Example App1
    proxy({
        'url': 'http://localhost:3000/' + "*",
        "headers": generateHeaders(req.user.id),
    })(req, res, next)
});

appRouter.use('/app2/*', (req, res, next) => {  //TODO: Example App2
    proxy({
        'url': 'https://lragji.github.io' + "*",
        "headers": generateHeaders(req.user.id),
    })(req, res, next)
});

appRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/hub.html'));
});

function generateHeaders(username) {
    let token = cache.get(username);
    if (token == undefined) {
        token = jwt.sign({ "username": username }, 'shhhhh');
        cache.put(username, token, (1000 * 60));
    }
    return {
        "Authorization": token,
        "tenant": "6585f391-df69-4be4-aaae-e4e982e509ca"
    }
}

module.exports = appRouter;