module.exports = (app, service) => {
    app.get("/item", async (req, res) => {
        res.json(await service.dao.getAll())
    })
    app.get("/item/:id", async (req, res) => {
        try {
            const item = res.json(await service.dao.getById(req.params.id))
            if(item === undefined){
                return res.status(404).end()
            }
            return res.json(item)
        }catch (e) {
            res.status(400).end()
        }
    })
    app.get("/item/list/:id_list", async (req, res) => {
        res.json(await service.dao.getByPropertyNameAndValue("id_list", req.params.id_list))
    })

    app.put("/item", async (req,res)=>{
        try {
            const item = req.body
            if ((item.id === undefined) || (item.id == null) || (!service.isValid(item))) {
                return res.status(400).end()
            }
            if (await service.dao.getById(item.id) === undefined) {
                return res.status(404).end()
            }
            service.dao.update(item)
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
    app.post("/item", async (req,res)=>{
        try {
            const item = req.body
            if (!service.isValid(item) ){
                return res.status(400).end()
            }
            service.dao.insert(item)
                .then( res.status(200).end())
                .catch(err => {
                    console.log(err)
                    res.status(500).end()
                })
        }catch (err) {
            console.log(err)
            res.status(400).end()
        }
    })

    app.patch("/item/:id", async (req, res) => {
        try{
            service.dao.updateCheck(req.params.id)
                .then(res.status(200).end())
                .catch(err => {
                    console.log(err)
                    res.status(500).end()
                })
        }catch (err) {
            console.log(err)
            res.status(400).end
        }
    })

    app.delete("/item/:id", async (req, res) => {
        try {
            const item = await service.dao.getById(req.params.id)
            if (item === undefined) {
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