const BaseDAO = require('./basedao')

module.exports = class ListDao extends BaseDAO {
    constructor(db) {
        super(db, "list")
    }

    insert(list){
        return new Promise(((resolve, reject) => {
            this.db.query(`INSERT INTO list(shop, date, archived) VALUES ($1,$2,$3) RETURNING id`,
                [list.shop, list.date, list.archived])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        }))
    }


}