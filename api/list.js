const utile = require('./utile')()
const Alert = require('../datamodel/model/alert')

module.exports = (app, service, servicePartageList,serviceAlert,serviceUserAccountHasRole, jwt) => {
    app.get("/list", jwt.validateJWT,async (req, res) => {
        res.json(await service.dao.getAll(req.user))
    })
    app.get("/list/no_archived", jwt.validateJWT, async (req, res) => {
        const user = req.user
        const allExpiredNoArchivedList = await service.dao.getAllExpiredNoArchived(user)
        for(list of allExpiredNoArchivedList){
            await utile.insertAlertExpireList(list, service, serviceAlert,Alert)
        }
        res.json(await service.dao.getAllNoArchived(user))
    })
    app.get("/list/archived", jwt.validateJWT, async (req, res) => {
        res.json(await service.dao.getAllArchived(req.user))
    })

    app.get("/list/:id", jwt.validateJWT,async (req, res) => {
        try {
            const list = await service.dao.getById(req.params.id, req.user)
            if (list === undefined) {
                return res.status(404).end()
            }
            if (list.useraccount_id !== req.user.id) {
                const partagedList = await servicePartageList.dao.getByListIdAndUserAccountId(req.params.id, req.user.id)
                if(partagedList[0].useraccount_id !== req.user.id){
                    return res.status(403).end()
                }
            }

            return res.json(list)
        }catch (e) {
            console.log(e)
            res.status(400).end()
        }
    })

    app.put("/list", jwt.validateJWT, async (req,res)=>{
        try {
            const list = req.body
            if ((list.id === undefined) || (list.id == null) || (!service.isValid(list))) {
                return res.status(400).end()
            }
            const prevList = await service.dao.getById(list.id)

            utile.verif(req,res, prevList)

            service.dao.update(list)
                .then(res.status(200).end())
                .catch(err => {
                    console.log(err)
                    res.status(500).end()

                })
        }catch (err) {
            console.log(err)
            res.status(400).end()
        }
    })
    app.post("/list", jwt.validateJWT, async (req,res)=>{
        try {
            const list = req.body
            const user = req.user
            list.useraccount_id = user.id
            if (!service.isValid(list) ){
                return res.status(400).end()
            }
            utile.verif(req,res,list)
            await utile.verifUserCanCreateList(req.user,service,serviceUserAccountHasRole,res)

            service.dao.insert(list)
                .then(_ => res.json(list))
                .catch(err => {
                    console.log(err)
                    res.status(500).end()
                })
        }catch (err) {
            console.log(err)
            res.status(400).end()
        }
    })

    app.patch("/list/:id", jwt.validateJWT, async (req, res) => {
        try{
            const listId = req.params.id
            const prevList = await service.dao.getById(listId)
            utile.verif(req,res,prevList)

            service.dao.archived(listId)
                .then(res.status(200).end())
                .catch(err => {
                    console.log(err)
                    res.status(500).end()
                })
        }catch (err) {
            console.log(err)
            res.status(400).end()
        }
    })
    app.patch("/list/no_archive/:id",jwt.validateJWT, async (req, res) => {
        try{
            const listId = req.params.id
            const prevList = await service.dao.getById(listId)
            utile.verif(req,res,prevList)
            service.dao.dearchived(listId)
                .then(res.status(200).end())
                .catch(err => {
                    console.log(err)
                    res.status(500).end()
                })
        }catch (err) {
            console.log(err)
            res.status(400).end()
        }
    })


    app.delete("/list/:id", jwt.validateJWT, async (req, res) => {
        try{
            const list = await service.dao.getById(req.params.id)
            utile.verif(req,res,list)
            service.dao.delete(req.params.id)
                .then(_ => {
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

    app.delete("/list/undo/:id", jwt.validateJWT, async (req, res) => {
        try{
            const list = await service.dao.getById(req.params.id)
            utile.verif(req,res,list)
            service.dao.undoDelete(req.params.id)
                .then(_ => {
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