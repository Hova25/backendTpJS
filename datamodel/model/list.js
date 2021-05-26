module.exports = class List {
    constructor(shop, date, archived, useraccount_id, deleted) {
        this.id = null
        this.shop = shop
        this.date = date
        this.archived = archived
        this.useraccount_id = useraccount_id
        if(deleted === undefined){
            this.deleted = false
        }else{
            this.deleted = true
        }
    }

}