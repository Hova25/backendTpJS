const utile = require('./utile')()

module.exports = (app, service, jwt) => {
    const url = "/partagelist"
    app.get(`${url}`, jwt.validateJWT,async (req, res) => {
        res.json(await service.dao.getAll(req.user))
    })

}