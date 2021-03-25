const ItemDAO = require("../datamodel/dao/itemDao")

module.exports = class ItemService {
    constructor(db){
        this.dao = new ItemDAO(db)
    }
    isValid(item){
        if(item.id_list!==undefined && item.label!==undefined && item.quantity!==undefined && item.checked!==undefined){
            // item.id_list = item.id_list.trim()
            // item.label = item.label.trim()
            // item.quantity = item.quantity.trim()
            // item.checked = item.checked.trim()
            return !(item.id_list === "" || item.label === "" || (item.quantity === "" && item.quantity<1) || item.checked === "");
        } else {
            return false
        }
    }
}