const BaseDAO = require("./basedao")
const UserAccount = require("../model/userAccount")

module.exports = class UserAccountDAO extends BaseDAO{
    constructor(db) {
        super(db, "useraccount");
    }
    insert(useraccount){
        return new Promise(((resolve, reject) => {
            this.db.query(`INSERT INTO ${this.tablename}(displayname,login,challenge,active,confirmation_code, password_code) VALUES($1,$2,$3,$4,$5,$6) RETURNING id `,
                [useraccount.displayname, useraccount.login, useraccount.challenge, useraccount.active, useraccount.confirmation_code, useraccount.password_code])
                .then(res => resolve(res.rows[0]) )
                .catch(e => {
                    console.log(e)
                    reject(e)
                })
        }))

    }
    getByLogin(login){
        return new Promise(((resolve, reject) => {
            this.db.query(`SELECT * FROM ${this.tablename} WHERE login=$1`,[login])
                .then(res => {
                    resolve(res.rows[0])
                } )
                .catch(e => reject(e))
        }))
    }

    updateValidation(confirmation_code){
        return this.db.query(`UPDATE ${this.tablename} SET active=true WHERE confirmation_code=$1 `,
            [confirmation_code])
    }
    updateConfirmationCode(user){
        const account = Object.assign(new UserAccount(), user)
        account.setConfirmationCode()
        return this.db.query(`UPDATE ${this.tablename} SET confirmation_code=$1 WHERE login=$2 RETURNING confirmation_code `,
            [account.confirmation_code,account.login])
    }
    updatePassword(login, password){
        return this.db.query(`UPDATE ${this.tablename} SET challenge=$1 WHERE login=$2`, [password,login])
    }
    passwordUpdateCode(user){
        const account = Object.assign(new UserAccount(), user)
        account.setPasswordCode()
        return this.db.query(`UPDATE ${this.tablename} SET confirmation_code=$1 WHERE login=$2 RETURNING confirmation_code `,
            [account.confirmation_code,account.login])
    }

}