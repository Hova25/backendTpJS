const BaseDAO = require('./basedao')

module.exports = class ItemDao extends BaseDAO {
    constructor(db) {
        super(db, "item")
    }

    insert(item){
        return new Promise(((resolve, reject) => {
            this.db.query(`INSERT INTO item(id_list,label,quantity,checked) VALUES ($1,$2,$3,$4) RETURNING id`,
                [item.id_list, item.label, item.quantity, item.checked])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        }))
    }

}