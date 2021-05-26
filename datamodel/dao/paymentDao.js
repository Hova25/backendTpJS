const BaseDAO = require('./basedao')

module.exports = class PaymentDao extends BaseDAO {
    constructor(db) {
        super(db, "payment")
    }

    insert(payment){
        return new Promise(((resolve, reject) => {
            this.db.query(`INSERT INTO ${this.tablename}(useraccount_id,number,expiration,cryptogram,price,date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
                [payment.useraccount_id, payment.number, payment.expiration, payment.cryptogram,payment.price, payment.date])
                .then(res => resolve(res.rows[0].id))
                .catch(err => reject(err))
        }))
    }
}