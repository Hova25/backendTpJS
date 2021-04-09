const utile = require('./utile')()

module.exports = (app, service, jwt) => {
    const url = "/alert"

    app.get(`${url}/:id`,jwt.validateJWT ,async (req, res) =>{
        try {
            const alert = await service.dao.getById(req.params.id, req.user)
            utile.verif(req,res,alert)
            res.json(alert)

        }catch (e) {
            console.log(e)
            res.status(400).end()
        }
    })
    app.get(`${url}`,jwt.validateJWT ,async (req, res) =>{
        try {
            const alerts = await service.dao.getAll(req.user)
            res.json(alerts)
        }catch (e) {
            console.log(e)
            res.status(400).end()
        }
    })
    app.get(`${url}/admin/get/all`,jwt.validateJWT ,async (req, res) => {
        utile.verifAdminRole(req,res)
        res.json(await service.dao.getAll(undefined,true))
    })
}