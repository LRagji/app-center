const path = require('path');

module.exports = class ConfigurableConstants {
    constructor(constantsFilepath, currentRootDirectory) {

        this.hostingPort = process.env.PORT || 4000;

        this.cookieSecret = "retaliation";

        this.cookieName = "hub-db89960b1248";// This should be a unique ID else session will collapse with each other.

        this.sessionMaxTimeout = (100 * 10 * 1000); //16.xx minutes

        this.resourcesFolder = path.join(currentRootDirectory + '/server-modules/hosting-content/unsecured/resources/');
        this.loginPagePath = path.join(currentRootDirectory + '/server-modules/hosting-content/unsecured/login/login.html');

        this.hostingUrls = {
            rootUrl: "/"
        }
        this.hostingUrls.loginPageUrl = this.hostingUrls.rootUrl + "login";
        this.hostingUrls.logoutPageUrl = this.hostingUrls.rootUrl + "logout";
        this.hostingUrls.applicationsUrl = this.hostingUrls.rootUrl + "apps";

    }
}