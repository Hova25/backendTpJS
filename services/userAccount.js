const bcrypt = require("bcrypt")
const UserAccountDAO = require("../datamodel/dao/userAccountDao")
const UserAccountHasRoleDAO = require("../datamodel/dao/userAccountHasRoleDao")
const UserAccount = require("../datamodel/model/userAccount")

module.exports = class UserAccountService{
    constructor(db) {
        this.dao =new UserAccountDAO(db)
        this.daoUserAccountHasRole = new UserAccountHasRoleDAO(db)
    }
    isValid(account){
        if(account.displayname!==''&& account.displayname!==undefined && account.login!==''&& account.login!==undefined){
            return true
        }else{
            return false
        }
    }
    comparePassword(password, hash){
        return bcrypt.compareSync(password, hash)
    }

    async validatePassword(login, password){
        const user = await this.dao.getByLogin(login)
        if(user===undefined){
            return false
        }
        return this.comparePassword(password, user.challenge)
    }

    hashPassword(password){
        return bcrypt.hashSync(password, 10)
    }
    insert(displayname, login,password, active){
        return this.dao.insert(new UserAccount(displayname,login, this.hashPassword(password), active))
    }
    updatePassword(login, password){
        return this.dao.updatePassword(login, this.hashPassword(password))
    }
}