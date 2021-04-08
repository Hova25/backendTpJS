const BaseDAO = require('./basedao')

module.exports = class UserAccountHasRoleDao extends BaseDAO {
    constructor(db) {
        super(db, "useraccount_has_role")
    }

    insert(useraccountHasRole){
        return new Promise(((resolve, reject) => {
            this.db.query(`INSERT INTO ${this.tablename}(id_role,id_useraccount) VALUES ($1,$2)`,
                [useraccountHasRole.idRole, useraccountHasRole.idUserAccount])
                .then(res => resolve(res.rows[0]))
                .catch(err => reject(err))
        }))
    }

}