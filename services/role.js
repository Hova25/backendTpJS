const RoleDAO = require("../datamodel/dao/roleDao")
const UserAccountHasRoleDAO = require("../datamodel/dao/userAccountHasRoleDao")

module.exports = class RoleService {
    constructor(db){
        this.dao = new RoleDAO(db)
        this.daoUserAccountHasRole = new UserAccountHasRoleDAO(db)
    }
    isValid(role){
        return true
    }
}