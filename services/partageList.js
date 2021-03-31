const PartageListDAO = require("../datamodel/dao/partageListDao")

module.exports = class ListService {
    constructor(db){
        this.dao = new PartageListDAO(db)
    }
}