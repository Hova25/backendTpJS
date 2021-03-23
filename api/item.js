module.exports = (app, service) => {
    app.get("/item", async (req, res) => {
        res.json(await service.dao.getAll())
    })
    app.get("/item/:id", async (req, res) => {
        try {
            const item = res.json(await service.dao.getById(req.params.id))
            if(item === undefined){
                return res.status(404).end
            }
            return res.json(item)
        }catch (e) {
            res.status(400).end
        }
    })
    // app.get("/item/list/:id_list", async (req, res) => {
    //     res.json(await service.dao.getAll())
    // })
}