const Role = require("../datamodel/model/role")
const UserAccountHasRole = require("../datamodel/model/userAccountHasRole")
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


    app.post(`${url}/useraccount_role`,jwt.validateJWT ,async (req,res)=> {
        try {
            utile.verifAdminRole(req, res)
            if (req.body.idRole !== undefined && req.body.idUserAccount) {
                await service.daoUserAccountHasRole.insert(new UserAccountHasRole(req.body.idRole, req.body.idUserAccount))
                res.status(200).end()
            } else {
                res.status(400).end()
            }
        }catch (e) {
            console.log(e)
            res.status(400).end()
        }
    })

    app.delete(`${url}/useraccount_role`,jwt.validateJWT ,async (req,res)=> {
        try {
            utile.verifAdminRole(req, res)
            if (req.body.idRole !== undefined && req.body.idUserAccount) {
                await service.daoUserAccountHasRole.delete(new UserAccountHasRole(req.body.idRole, req.body.idUserAccount))
                res.status(200).end()
            } else {
                res.status(400).end()
            }
        }catch (e) {
            console.log(e)
            res.status(400).end()
        }
    })


}