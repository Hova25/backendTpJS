const BaseDAO = require('./basedao')

module.exports = class RoleDao extends BaseDAO {
    constructor(db) {
        super(db, "alert")
    }

    insert(alert){
        return new Promise(((resolve, reject) => {
            this.db.query(`INSERT INTO ${this.tablename}(title,text,date,useraccount_id,checked) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
                [alert.title, alert.text, alert.date, alert.useraccount_id, alert.checked])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        }))
    }

}