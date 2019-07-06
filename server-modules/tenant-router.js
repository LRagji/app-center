const express = require('express');


module.exports = class tenantRouter {
    constructor() {
        const appRouter = express();
        this.router = appRouter;
    }
}