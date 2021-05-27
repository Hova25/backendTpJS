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
                    await serviceUserAccountHasRole.dao.insert(new UseraccountHasRole(3,req.user.id))
                    serviceAlert.dao.insert(new Alert(req.user.id, "Enfin abonné !", `Toute l'équipe de myShopList vous remercie ${req.user.displayname} de votre confiance ainsin que votre soutien !`))
                    app.mailer.send('subscription_email', {
                        to: `${req.body.login}`,
                        subject: 'MyShopList - Abonnement',
                        otherProperty: 'Other Property',
                        name:req.body.displayname,
                        payment:payment
                    }, function (err) {
                        if (err) {
                            // handle error
                            console.log(err);
                            res.send('There was an error sending the email');
                            return;
                        }
                        res.send('Email Sent');
                    });
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