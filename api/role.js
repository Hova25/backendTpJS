const Role = require("../datamodel/model/role")
const utile = require('./utile')()

module.exports = (app, service, jwt) => {
    const url = "/role"
    app.get(`${url}`,async (req, res) => {
        if(req.query.useraccount_id!==undefined){
            res.json(await service.daoUserAccountHasRole.getRolesByIdUserAccount(req.query.useraccount_id))
        }else{
            res.json(await service.dao.getAll(undefined, true))
        }
    })
    app.get(`${url}/:id`,async (req, res) => {
        res.json(await service.dao.getById(req.params.id))
    })




}