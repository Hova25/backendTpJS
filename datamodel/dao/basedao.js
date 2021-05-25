module.exports = class BaseDAO {
    constructor(db, tablename) {
        this.db = db
        this.tablename = tablename
    }
    delete(id) {
        return this.db.query(`DELETE FROM ${this.tablename} WHERE id=$1`, [id])
    }
    getById(id) {
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM ${this.tablename} WHERE id=$1`, [ id ])
                .then(res => resolve(res.rows[0]) )
                .catch(e => reject(e)))
    }
    getAll(user,noSecure, condition, orderType){
        let filterUserAccount = ""
        if(user!==undefined){
            filterUserAccount = `WHERE useraccount_id = ${user.id}`
        }else{
            if(noSecure!==true){
                filterUserAccount = "WHERE 1=0"
            }
        }
        let where = ""
        if(condition!==undefined){
            if(filterUserAccount === ""){
                where = condition
            }else{
                where = ` AND ${condition}`
            }
        }
        let typeOrder = "ASC"
        if(orderType !== undefined){
            typeOrder = orderType
        }
        return new Promise(((resolve, reject) => {
            this.db.query(`SELECT * from ${this.tablename} ${filterUserAccount} ${where} ORDER BY id ${typeOrder}`)
                .then(res=>resolve(res.rows))
                .catch(err=> reject(err))
        }))
    } 
    getByPropertyNameAndValue(propertyName, value, user, secure){
        let filterUserAccount = ""
        if(secure!==false) {
            if (user !== undefined) {
                filterUserAccount = `AND useraccount_id = ${user.id}`
            } else {
                filterUserAccount = "AND 1=0"
            }
        }
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM ${this.tablename} WHERE ${propertyName}=$1 ${filterUserAccount} ORDER BY id`, [ value ])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)))
    }

}