const BaseDAO = require('./basedao')

module.exports = class PartageListDao extends BaseDAO {
    constructor(db) {
        super(db, "partageList")
    }

    insert(partageList){
        return new Promise(((resolve, reject) => {
            this.db.query(`INSERT INTO ${this.tablename}(id_list,owneruser_id,useraccount_id, edit) VALUES ($1,$2,$3,$4) RETURNING id`,
                [partageList.id_list, partageList.owneruser_id, partageList.useraccount_id, partageList.edit])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        }))
    }
    getByIdAndOwnerId(listId, ownerId){
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM ${this.tablename} WHERE id=$1 AND owneruser_id=$2 ORDER BY useraccount_id`, [ listId, ownerId ])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)))
    }


    getByListIdAndOwnerId(listId, ownerId){
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM ${this.tablename} WHERE id_list=$1 AND owneruser_id=$2 ORDER BY useraccount_id`, [ listId, ownerId ])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)))
    }

    getByListIdAndUserAccountId(listId, userAccountId){
        let filterIdList = ""
        if(listId!==undefined){
            filterIdList = ` AND id_list = ${listId} `
        }
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM ${this.tablename} WHERE useraccount_id=$1 ${filterIdList} ORDER BY id DESC`, [ userAccountId ])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)))
    }

    async updateEdit(partageList){
        if(partageList!==undefined){
            if(partageList.edit===true) {
                return this.db.query(`UPDATE ${this.tablename} SET edit=false WHERE id=$1 `,
                    [partageList.id])
            }else{
                return this.db.query(`UPDATE ${this.tablename} SET edit=true WHERE id=$1 `,
                    [partageList.id])
            }
        }
    }

}