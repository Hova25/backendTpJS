const BaseDAO = require('./basedao')

module.exports = class AlertDao extends BaseDAO {
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

    async updateCheck(id){
        const alert = await this.getById(id)
        if(alert!==undefined){
            if(alert.checked===true) {
                return await this.db.query(`UPDATE ${this.tablename} SET checked=false WHERE id=$1 `,
                    [id])
            }else{
                return await this.db.query(`UPDATE ${this.tablename} SET checked=true WHERE id=$1 `,
                    [id])
            }
        }
    }
    getByTextAndCheckedFalseAndUserAccountId(text, useraccount_id) {
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM ${this.tablename} WHERE text LIKE $1 AND useraccount_id=$2`, [ text, useraccount_id ])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)))
    }

}