const BaseDAO = require('./basedao')

module.exports = class RoleDao extends BaseDAO {
    constructor(db) {
        super(db, "role")
    }

    insert(role){
        return new Promise(((resolve, reject) => {
            this.db.query(`INSERT INTO ${this.tablename}(name,description) VALUES ($1,$2) RETURNING id`,
                [role.name, role.description])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        }))
    }

}