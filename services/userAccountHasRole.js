const UserAccountHasRoleDAO = require("../datamodel/dao/userAccountHasRoleDao")

module.exports = class UserAccountHasRoleService {
    constructor(db){
        this.dao = new UserAccountHasRoleDAO(db)
    }
    isValid(userAccountHasRole){
        return true
    }
}