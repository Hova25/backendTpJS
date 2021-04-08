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

    getRolesByIdUserAccount(userAccountId){
        return new Promise(((resolve, reject) => {
            this.db.query(`SELECT * FROM ${this.tablename} INNER JOIN role ON role.id = useraccount_has_role.id_role WHERE id_useraccount=$1`,
                [userAccountId])
                .then(res => resolve(res.rows))
                .catch(err => reject(err))
        }))
    }
    checkIfRuleByIdRuleAndIdUserAccount(idRule, idUserAccount){
        return new Promise(((resolve, reject) => {
            this.db.query(`SELECT * FROM ${this.tablename} WHERE id_role=$1 AND id_useraccount=$2`,
                [idRule,idUserAccount])
                .then(res => resolve(res.rows[0]))
                .catch(err => reject(err))
        }))
    }
}