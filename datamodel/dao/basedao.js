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
    getAll(){
        return new Promise(((resolve, reject) => {
            this.db.query(`SELECT * from ${this.tablename}`)
                .then(res=>resolve(res.rows))
                .catch(err=> reject(err))
        }))
    } 
    getByPropertyNameAndValue(propertyName, value){
        return new Promise((resolve, reject) =>
            this.db.query(`SELECT * FROM ${this.tablename} WHERE ${propertyName}=$1 ORDER BY id`, [ value ])
                .then(res => resolve(res.rows) )
                .catch(e => reject(e)))
    }

}