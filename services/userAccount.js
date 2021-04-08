const bcrypt = require("bcrypt")
const UserAccountDAO = require("../datamodel/dao/userAccountDao")
const UserAccount = require("../datamodel/model/userAccount")

module.exports = class UserAccountService{
    constructor(db) {
        this.dao =new UserAccountDAO(db)
    }

    comparePassword(password, hash){
        return bcrypt.compareSync(password, hash)
    }

    async validatePassword(login, password){
        const user = await this.dao.getByLogin(login)
        return this.comparePassword(password, user.challenge)
    }

    hashPassword(password){
        return bcrypt.hashSync(password, 10)
    }
    insert(displayname, login,password){
        return this.dao.insert(new UserAccount(displayname,login, this.hashPassword(password)))
    }
    updatePassword(login, password){
        return this.dao.updatePassword(login, this.hashPassword(password))
    }
}