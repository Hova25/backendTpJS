const AlertDAO = require("../datamodel/dao/alertDao")

module.exports = class AlertService {
    constructor(db) {
        this.dao = new AlertDAO(db)
    }

}