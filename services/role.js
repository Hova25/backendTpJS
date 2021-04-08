const RoleDAO = require("../datamodel/dao/roleDao")

module.exports = class RoleService {
    constructor(db){
        this.dao = new RoleDAO(db)
    }
    isValid(role){
        return true
    }
}