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
        console.log("yolyyl")
        console.log(login, password)
        const user = await this.dao.getByLogin(login)
        console.log(user)
        return this.comparePassword(password, user.challenge)
    }

    hashPassword(password){
        return bcrypt.hashSync(password, 10)
    }
    insert(displayname, login,password){
        return this.dao.insert(new UserAccount(displayname,login, this.hashPassword(password)))
    }
}