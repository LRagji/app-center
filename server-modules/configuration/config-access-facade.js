
const configConstants = require("./config-constants");
const path = require('path');

module.exports = class configFacade {
    constructor(currentRootDirectory) {
        this.tenants = this.tenants.bind(this);
        this.constants = new configConstants(currentRootDirectory);
        this._currentRootDirectory = currentRootDirectory;

    }

    tenants() {
        return [{
            name: "dev01",
            id: "1e1bdb55-4396-44dd-90ea-65f98fbe22da",
            authentication: {
                strategy: "local",
                loginPagePath: path.join(this.constants.tenantFolderPath, "dev01-login.html"),
                options: {
                    failureRedirect: "/tenants/dev01/login/"
                }
            },
            sessionTimeout: (100 * 10 * 1000), //16.xx minutes
            sessionSecret: "retaliation",
            homePagePath: path.join(this.constants.tenantFolderPath, "/dev01.html"),
            applications: [
                {
                    name: "app1",
                    url: "https://alerts-dobara-hub.run.aws-usw02-pr.ice.predix.io/"
                },
                {
                    name: "app2",
                    url: "https://asset-dashboard.run.aws-usw02-pr.ice.predix.io/"
                }
            ]
        },
        {
            name: "dev02",
            id: "1e1bdb55-4396-44dd-90ea-65f98fbe22d4",
            authentication: {
                strategy: "basic",
                loginPagePath: path.join(this.constants.tenantFolderPath, "dev02-login.html"),
                options: {
                    session: true
                }
            },
            sessionTimeout: (100 * 10 * 1000), //16.xx minutes
            sessionSecret: "retaliation",
            homePagePath: path.join(this.constants.tenantFolderPath, "dev02.html"),
            applications: [
                {
                    name: "app1",
                    url: "https://alerts-dobara-hub.run.aws-usw02-pr.ice.predix.io/"
                },
                {
                    name: "app2",
                    url: "https://asset-dashboard.run.aws-usw02-pr.ice.predix.io/"
                }
            ]
        }]
    }
}