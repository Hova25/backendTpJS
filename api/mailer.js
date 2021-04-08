const utile = require('./utile')()

module.exports = (app) => {
    app.post('/mailer/validation_account', (req, res, next) => {
        app.mailer.send('validateEmail', {
            to: `${req.body.login}`,
            subject: 'MyShopList - Confirmation de votre compte',
            otherProperty: 'Other Property',
            name:req.body.displayname,
            confirmation_code: req.body.confirmation_code,
            url_confirmation: `${utile.getSiteBaseUrl()}confirmation.html?code=${req.body.confirmation_code}`
        }, function (err) {
            if (err) {
                // handle error
                console.log(err);
                res.send('There was an error sending the email');
                return;
            }
            res.send('Email Sent');
        });
    });

    app.post('/mailer/reset_password', (req,res)=> {
        app.mailer.send('reset_password_email', {
            to: `${req.body.login}`,
            subject: 'MyShopList - Re-initialisation mot de passe',
            otherProperty: 'Other Property',
            name:req.body.displayname,
            url_password: `${utile.getSiteBaseUrl()}confirmation.html?password_reset=${req.body.password_code}`
        }, function (err) {
            if (err) {
                // handle error
                console.log(err);
                res.send('There was an error sending the email');
                return;
            }
            res.send('Email Sent');
        });
    })

}