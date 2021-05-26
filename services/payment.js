const PaymentDAO = require("../datamodel/dao/paymentDao")

module.exports = class PaymentService {
    constructor(db) {
        this.dao = new PaymentDAO(db)
    }
    isValid(payment){
        if(
            payment.number === undefined ||
            payment.expiration === undefined ||
            payment.cryptogram === undefined ||
            payment.price === undefined ||
            payment.date === undefined ||
            payment.useraccount_id === undefined
        ){
            return false
        }
        return true
    }
}