const AlertDAO = require("../datamodel/dao/alertDao")

module.exports = class AlertService {
    constructor(db) {
        this.dao = new AlertDAO(db)
    }
    isValid(alert){
        if(
            alert.title === undefined ||
            alert.text === undefined ||
            alert.date === undefined ||
            alert.useraccount_id === undefined
        ){
            return false
        }
        return true
    }
}