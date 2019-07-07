const express = require('express');


module.exports = class tenantRouter {
    constructor(config) {
        const appRouter = express();
        this._config = config;

        this._hostRoutes = this._hostRoutes.bind(this);
       
        this.router = this._hostRoutes(appRouter);
    }

    _hostRoutes(router) {
        const allTenants = this._config.tenants();
        allTenants.forEach(tenantInfo => {

            //Set App-center Url for this tenant
            const tenantUrl = this._config.constants.urlSeperator + tenantInfo.name + this._config.constants.urlSeperator + "*";
            router.get(tenantUrl, (req, res) => res.sendFile(this._config.constants.appcenterPagePath));
            console.log("       " + tenantUrl + " ---> " + this._config.constants.appcenterPagePath);

        });
        return router;
    }
}