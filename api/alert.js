const utile = require('./utile')()
const Alert = require('../datamodel/model/alert')

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
            let condition = undefined
            if(req.query.checked !== undefined ){
                condition = ` checked = ${req.query.checked} `
            }
            const alerts = await service.dao.getAll(req.user,false,condition, "DESC" )
            res.json(alerts)
        }catch (e) {
            console.log(e)
            res.status(400).end()
        }
    })


    app.patch(`${url}/:id`,jwt.validateJWT, async (req, res) => {
        try{
            const alertId = req.params.id
            const prevItem = await service.dao.getById(alertId)
            utile.verif(req,res,prevItem)

            service.dao.updateCheck(alertId)
                .then(_ => {
                    res.status(200).end()
            })
                .catch(err => {
                    console.log(err)
                    res.status(500).end()
                })
        }catch (err) {
            console.log(err)
            res.status(400).end
        }
    })

    app.get(`${url}/admin/get/all`,jwt.validateJWT ,async (req, res) => {
        utile.verifAdminRole(req,res)
        res.json(await service.dao.getAll(undefined,true))
    })

    app.post(`${url}/admin/insert`, jwt.validateJWT, async (req,res) => {
        try {
            utile.verifAdminRole(req,res)
            const alert =  Object.assign(new Alert(),req.body)
            if (!service.isValid(alert) ){
                return res.status(400).end()
            }
            service.dao.insert(alert)
                .then(_ => res.status(200).end())
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