
const configConstants = require("./config-constants")

module.exports = class configFacade {
    constructor(currentRootDirectory) {
        this.tenants = this.tenants.bind(this);
        this.constants = new configConstants('', currentRootDirectory);

    }

    tenants() {
        return [{
            name: "dev01",
            id: "1e1bdb55-4396-44dd-90ea-65f98fbe22da",
            authenticationStrategy: "/login"
        }]
    }
}