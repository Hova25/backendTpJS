const ItemDAO = require("../datamodel/dao/itemDao")

module.exports = class ItemService {
    constructor(db){
        this.dao = new ItemDAO(db)
    }
}