const ListDAO = require("../datamodel/dao/listDao")

module.exports = class ListService {
    constructor(db){
        this.dao = new ListDAO(db)
    }
    isValid(list){


        return true
    }
}