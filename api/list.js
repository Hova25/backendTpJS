module.exports = (app, service) => {
    app.get("/list", async (req, res) => {
        res.json(await service.dao.getAll())
    })
    app.get("/list/no_archived", async (req, res) => {
        res.json(await service.dao.getAllNoArchived())
    })
    app.get("/list/archived", async (req, res) => {
        res.json(await service.dao.getAllArchived())
    })

    app.get("/list/:id", async (req, res) => {
        try {
            const list = res.json(await service.dao.getById(req.params.id))
            if(list === undefined){
                return res.status(404).end()
            }
            return res.json(list)
        }catch (e) {
            res.status(400).end()
        }
    })

    app.put("/list", async (req,res)=>{
        try {
            const list = req.body
            if ((list.id === undefined) || (list.id == null) || (!service.isValid(list))) {
                return res.status(400).end()
            }
            if (await service.dao.getById(list.id) === undefined) {
                return res.status(404).end()
            }
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
    app.post("/list", async (req,res)=>{
        try {
            const list = req.body
            if (!service.isValid(list) ){
                return res.status(400).end()
            }
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

    app.patch("/list/:id", async (req, res) => {
        try{
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
    app.patch("/list/no_archive/:id", async (req, res) => {
        try{
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


    app.delete("/list/:id", async (req, res) => {
        try{
            const list = await service.dao.getById(req.params.id)
            if(list === undefined){
                return res.status(404).end()
            }
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