module.exports = (app, service) => {
    app.get("/list", async (req, res) => {
        res.json({"hello":"listApi"})
        //res.json(await service.dao.getAll(req.user))
    })
}