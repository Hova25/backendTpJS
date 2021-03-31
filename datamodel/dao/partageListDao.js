const BaseDAO = require('./basedao')

module.exports = class PartageListDao extends BaseDAO {
    constructor(db) {
        super(db, "partageList")
    }

    insert(partageList){
        return new Promise(((resolve, reject) => {
            this.db.query(`INSERT INTO ${this.tablename}(id_list, useraccount_id, edit) VALUES ($1,$2,$3) RETURNING id`,
                [partageList.id_list, partageList.useraccount_id, partageList.edit])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        }))
    }

}