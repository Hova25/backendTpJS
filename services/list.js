const ListDAO = require("../datamodel/dao/listDao")

module.exports = class ListService {
    constructor(db){
        this.dao = new ListDAO(db)
    }
    isValid(list){
        if(list.shop === undefined || list.shop === ""){
            return false
        }
        if(list.date === undefined || list.date === ""){
            return false
        }
        if(list.useraccount_id === undefined || list.useraccount_id === ""){
            return false
        }

        return true
    }
}