module.exports = class MailerService {
    subscriptionEmail(app,req,res){
        app.mailer.send('subscription_email', {
            to: `${req.body.login}`,
            subject: 'MyShopList - Abonnement',
            otherProperty: 'Other Property',
            name:req.body.displayname,
        }, function (err) {
            if (err) {
                // handle error
                console.log(err);
                res.send('There was an error sending the email');
                return;
            }
            res.send('Email Sent');
        });
    }

}