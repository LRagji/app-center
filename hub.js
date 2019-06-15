const express = require('express');
const app = express();
const proxy = require('express-request-proxy');
const path = require('path');
const port = 3000;

app.use('/app1/*', (req, res, next) => {
    proxy({
        'url': 'http://139.59.89.208/'
    })(req, res, next)
});

app.use('/app2/*', (req, res, next) => {
    proxy({
        'url': 'https://lragji.github.io/'
    })(req, res, next)
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))