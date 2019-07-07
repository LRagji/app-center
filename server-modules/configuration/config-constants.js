const path = require('path');

module.exports = class ConfigurableConstants {
    constructor(currentRootDirectory) {

        this.urlSeperator = "/";

        this.hostingPort = process.env.PORT || 4000;

        this.tenantFolderPath = path.join(currentRootDirectory + '/hosting-modules/un-secured/tenants/');
        this.resourcesFolder = path.join(currentRootDirectory + '/hosting-modules/un-secured/static/');
        this.loginPagePath = path.join(currentRootDirectory + '/server-modules/hosting-content/unsecured/login/login.html');
        this.appcenterPagePath = path.join(currentRootDirectory + '/hosting-modules/secured/app-center.html');

        this.hostingUrls = {
            rootUrl: "/"
        }
        this.hostingUrls.notfoundUrl = this.hostingUrls.rootUrl + "404.html";
        this.hostingUrls.loginPageUrl = this.hostingUrls.rootUrl + "login/";
        this.hostingUrls.logoutPageUrl = this.hostingUrls.rootUrl + "logout/";
        this.hostingUrls.applicationsUrl = this.hostingUrls.rootUrl + "apps/";
        this.hostingUrls.tenantsUrl = this.hostingUrls.rootUrl + "tenants/";
    }
}