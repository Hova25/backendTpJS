const utile = require('./utile')()
const Alert = require('../datamodel/model/alert')
module.exports = (app, service, listService,alertService, jwt) => {
    app.get("/item",jwt.validateJWT ,async (req, res) => {
        res.json(await service.dao.getAll(req.user))
    })
    app.get("/item/:id",jwt.validateJWT ,async (req, res) => {
        try {
            // const item = await service.dao.getById(req.params.id)
            // utile.verif(req,res,item)
            const item = await service.dao.getByPropertyNameAndValueWithLeftPartageList("id", req.params.id, req.user )
            return res.json(item)
        }catch (e) {
            res.status(400).end()
        }
    })
    app.get("/item/list/:id_list",jwt.validateJWT ,async (req, res) => {
        const user = {}
        // user.id = req.query.useraccount_id
        // if(req.query.useraccount_id){
        //     res.json(await service.dao.getByPropertyNameAndValue("id_list", req.params.id_list, user ))
        // }else{
        //     res.json(await service.dao.getByPropertyNameAndValue("id_list", req.params.id_list, req.user ))
        // }
        res.json(await service.dao.getByPropertyNameAndValueWithLeftPartageList("id_list", req.params.id_list, req.user ))
    })

    app.put("/item",jwt.validateJWT , async (req,res)=>{
        try {
            const item = req.body
            if ((item.id === undefined) || (item.id == null) || (!service.isValid(item))) {
                return res.status(400).end()
            }
            const prevItem = await service.dao.getById(item.id)
            utile.verif(req,res,prevItem)

            service.dao.update(item)
                .then(async _ => {
                    utile.insertAlertModificationList(prevItem.id_list, req.user,listService,alertService,Alert)
                    res.status(200).end()
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).end()

                })
        }catch (err) {
            console.log(err)
            res.status(400).end()
        }
    })
    app.post("/item",jwt.validateJWT, async (req,res)=>{
        try {
            const item = req.body
            if (!service.isValid(item) ){
                return res.status(400).end()
            }
            item.useraccount_id = req.user.id
            service.dao.insert(item)
                .then(async _ => {
                    utile.insertAlertModificationList(item.id_list, req.user,listService,alertService,Alert)
                    res.json(item)
                    //res.status(200).end()
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).end()
                })
        }catch (err) {
            console.log(err)
            res.status(400).end()
        }
    })

    app.patch("/item/:id",jwt.validateJWT, async (req, res) => {
        try{
            const itemId = req.params.id
            const prevItem = await service.dao.getById(itemId, req.user)
            // utile.verif(req,res,prevItem)

            service.dao.updateCheck(itemId)
                .then(async _ => {
                    utile.insertAlertModificationList(prevItem.id_list, req.user,listService,alertService,Alert)
                    res.status(200).end()
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).end()
                })
        }catch (err) {
            console.log(err)
            res.status(400).end
        }
    })

    app.delete("/item/:id",jwt.validateJWT, async (req, res) => {
        try {
            const item = await service.dao.getById(req.params.id)
            // utile.verif(req,res,item)
            service.dao.delete(req.params.id)
                .then(async _ => {
                    utile.insertAlertModificationList(item.id_list, req.user,listService,alertService,Alert)
                    res.status(200).end()
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).end()
                })
        }catch (err) {
            console.log(err)
            res.status(400).end()
        }
    })
}