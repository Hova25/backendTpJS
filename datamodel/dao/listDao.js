const BaseDAO = require('./basedao')

module.exports = class ListDao extends BaseDAO {
    constructor(db) {
        super(db, "list")
    }

    getAllNoArchived(user){
        return new Promise(((resolve, reject) => {
            this.db.query(`SELECT * from ${this.tablename} WHERE archived = false AND useraccount_id = $1 ORDER BY id DESC`, [user.id])
                .then(res=>resolve(res.rows))
                .catch(err=> reject(err))
        }))
    }
    getAllArchived(){
        return new Promise(((resolve, reject) => {
            this.db.query(`SELECT * from ${this.tablename} WHERE archived = true ORDER BY id DESC`)
                .then(res=>resolve(res.rows))
                .catch(err=> reject(err))
        }))
    }

    insert(list){
        return new Promise(((resolve, reject) => {
            this.db.query(`INSERT INTO ${this.tablename}(shop, date, archived, useraccount_id) VALUES ($1,$2,$3, $4) RETURNING id`,
                [list.shop, list.date, list.archived, list.useraccount_id])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        }))
    }
    udpate(list){
        return this.db.query(`UPDATE ${this.tablename} SET shop=$1,date=$2,archived=$3 WHERE id=$4 `,
            [list.shop, list.date, list.archived, list.id])
    }

    archived(id){
        return this.db.query(`UPDATE ${this.tablename} SET archived=true WHERE id=$1 `,
            [id])
    }
    dearchived(id){
        return this.db.query(`UPDATE ${this.tablename} SET archived=false WHERE id=$1 `,
            [id])
    }

    async delete(id){
        await this.db.query(`DELETE FROM item WHERE id_list=$1`, [id])
        return this.db.query(`DELETE FROM ${this.tablename} WHERE id=$1`, [id])
    }


}