const BaseDAO = require('./basedao')

module.exports = class ItemDao extends BaseDAO {
    constructor(db) {
        super(db, "item")
    }

    insert(item){
        return new Promise(((resolve, reject) => {
            this.db.query(`INSERT INTO ${this.tablename}(id_list,label,quantity,checked,useraccount_id) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
                [item.id_list, item.label, item.quantity, item.checked, item.useraccount_id])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        }))
    }

    update(item){
        return this.db.query(`UPDATE ${this.tablename} SET id_list=$1,label=$2,quantity=$3,checked=$4 WHERE id=$5`,
            [item.id_list, item.label, item.quantity, item.checked, item.id])
    }

    async updateCheck(id){
        const item = await this.getById(id)
        if(item!==undefined){
            if(item.checked===true) {
                return this.db.query(`UPDATE ${this.tablename} SET checked=false WHERE id=$1 `,
                    [id])
            }else{
                return this.db.query(`UPDATE ${this.tablename} SET checked=true WHERE id=$1 `,
                    [id])
            }
        }
    }

}