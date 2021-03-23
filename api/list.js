module.exports = (app, service) => {
    app.get("/list", async (req, res) => {
        res.json(await service.dao.getAll())
    })

    app.get("/list/:id", async (req, res) => {
        try {
            const list = res.json(await service.dao.getById(req.params.id))
            if(list === undefined){
                return res.status(404).end
            }
            return res.json(list)
        }catch (e) {
            res.status(400).end
        }
    })
}