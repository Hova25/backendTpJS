const utile = require('./utile')()
module.exports = (app, service, jwt) => {



    app.get("/list", jwt.validateJWT,async (req, res) => {
        res.json(await service.dao.getAll(req.user))
    })
    app.get("/list/no_archived", jwt.validateJWT, async (req, res) => {
        const user = req.user
        res.json(await service.dao.getAllNoArchived(user))
    })
    app.get("/list/archived", jwt.validateJWT, async (req, res) => {
        res.json(await service.dao.getAllArchived(req.user))
    })

    app.get("/list/:id", jwt.validateJWT,async (req, res) => {
        try {
            const list = await service.dao.getById(req.params.id, req.user)
            utile.verif(req,res,list)
            return res.json(list)
        }catch (e) {
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
            if (!service.isValid(list) ){
                return res.status(400).end()
            }
            list.useraccount_id = user.id
            service.dao.insert(list)
                .then(id => res.json(id))
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

            service.dao.archived(req.params.id)
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
            service.dao.dearchived(req.params.id)
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
}