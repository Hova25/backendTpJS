module.exports = (app, service) => {
    app.get("/item", async (req, res) => {
        res.json({"hello":"itemApi"})
        //res.json(await service.dao.getAll(req.user))
    })
}