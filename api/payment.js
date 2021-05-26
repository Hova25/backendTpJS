const utile = require('./utile')()
const Payment = require('../datamodel/model/payment')

module.exports = (app, service, jwt) => {
    const url = "/payment"

    app.post(`${url}`, jwt.validateJWT, async (req,res) => {
        try {
            const payment =  Object.assign(new Payment(),req.body)
            utile.verif(req,res, payment)
            if (!service.isValid(payment) ){
                return res.status(400).end()
            }
            service.dao.insert(payment)
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