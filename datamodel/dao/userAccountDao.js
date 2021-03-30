const BaseDAO = require("./basedao")

module.exports = class UserAccountDAO extends BaseDAO{
    constructor(db) {
        super(db, "useraccount");
    }
    insert(useraccount){
        return new Promise(((resolve, reject) => {
            this.db.query(`INSERT INTO ${this.tablename}(displayname,login,challenge) VALUES($1,$2,$3) RETURNING id `,
                [useraccount.displayName, useraccount.login, useraccount.challenge])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e))
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
}