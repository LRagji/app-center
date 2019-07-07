const path = require('path');

module.exports = class ConfigurableConstants {
    constructor(currentRootDirectory) {

        this.urlSeperator = "/";

        this.hostingPort = process.env.PORT || 4000;

        this.tenantFolderPath = path.join(currentRootDirectory + '/hosting-modules/un-secured/tenants/');
        this.resourcesFolder = path.join(currentRootDirectory + '/hosting-modules/un-secured/static/');
        this.appcenterPagePath = path.join(currentRootDirectory + '/hosting-modules/secured/app-center.html');

        this.hostingUrls = {
            rootUrl: "/"
        }
        this.hostingUrls.tenantsUrl = this.hostingUrls.rootUrl + "tenants/";
    }
}