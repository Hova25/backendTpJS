module.exports = class List {
    constructor(id,useraccount_id,number,expiration,cryptogram ,price,date) {
        this.id = null
        this.useraccount_id = useraccount_id
        this.number = number
        this.expiration = expiration
        this.cryptogram = cryptogram
        this.price = price
        if(date===undefined){
            this.date = new Date().toISOString()
        }else{
            this.date = date
        }

    }

}