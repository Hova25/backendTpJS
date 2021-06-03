const utile = require('./utile')()

module.exports = (app, service,serviceUserAccountHasRole,serviceList,serviceUserAccount, jwt) => {
    const url = "/partagelist"
    app.get(`${url}`, jwt.validateJWT,async (req, res) => {
        res.json(await service.dao.getAll(req.user))
    })
    app.get(`${url}/partaged`,jwt.validateJWT, async (req, res ) => {
        try{
            if(req.user.id!==undefined){
                let partagedLists = await service.dao.getByListIdAndUserAccountId(undefined ,req.user.id)

                for(let partagedList of partagedLists){
                    partagedList.list = await serviceList.dao.getById(partagedList.id_list)
                }
                if(req.query.just_list !== undefined){
                    partagedLists = utile.array_column(partagedLists, "list")
                }
                return res.json(partagedLists)
            }
            res.status(401).end()
        }
        catch (e) {
            res.status(400).end()
        }
    })
    app.get(`${url}/:id_list`, jwt.validateJWT, async (req, res) => {
        try{
            if(req.query.useraccount_id!==undefined){
                const partagedList = await service.dao.getByListIdAndUserAccountId( req.params.id_list, req.query.useraccount_id)
                return res.json(partagedList)
            }
            else if(req.query.owneruser_id!==undefined){
                const partagedList = await service.dao.getByIdAndOwnerId( req.params.id_list, req.query.owneruser_id)
                return res.json(partagedList[0])
            }
            else{
                const partagedList = await service.dao.getByListIdAndOwnerId( req.params.id_list, req.user.id)
                return res.json(partagedList)
            }
        }
        catch (e) {
            res.status(400).end()
        }
    })

    app.post(`${url}`,jwt.validateJWT, async (req,res)=>{
        try {
            const partageList = req.body
            if (!service.isValid(partageList) ){
                return res.status(400).end()
            }
            await utile.verifVipRole(req.user, serviceUserAccountHasRole, res)
            partageList.owneruser_id = req.user.id
            service.dao.insert(partageList)
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


    app.patch(`${url}/:partageListId`,jwt.validateJWT, async (req, res) => {
        try{
            const partageListId = req.params.partageListId
            const prevPartageList = await service.dao.getById(partageListId)
            utile.verifByOwner(req,res,prevPartageList)

            service.dao.updateEdit(prevPartageList)
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

    app.delete(`${url}/:id`,jwt.validateJWT, async (req, res) => {
        try {
            const partageList = await service.dao.getById(req.params.id)
            utile.verifByOwner(req,res,partageList)
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
}