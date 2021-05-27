const utile = require('./utile')()
const Payment = require('../datamodel/model/payment')
const UseraccountHasRole = require('../datamodel/model/userAccountHasRole')
const Alert = require('../datamodel/model/alert')

module.exports = (app, service,serviceUserAccountHasRole, serviceAlert, jwt) => {
    const url = "/payment"

    app.post(`${url}`, jwt.validateJWT, async (req,res) => {
        try {
            const payment =  Object.assign(new Payment(),req.body)
            utile.verif(req,res, payment)
            if (!service.isValid(payment) ){
                return res.status(400).end()
            }
            service.dao.insert(payment)
                .then(async _ => {
                    if(payment.price === "4.9"){
                        await serviceUserAccountHasRole.dao.insert(new UseraccountHasRole(3,req.user.id))
                        await serviceAlert.dao.insert(new Alert(req.user.id, "Enfin abonné !", `Toute l'équipe de myShopList vous remercie ${req.user.displayname} de votre confiance ainsin que votre soutien !`))
                    }
                    res.status(200).end()
                })
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