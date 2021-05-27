const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const swig = require('swig')


const itemService = require("./services/item")
const listService = require("./services/list")
const userAccountService = require("./services/userAccount")
const partageListService = require("./services/partageList")
const roleService = require("./services/role")
const userAccountHasRoleService = require("./services/userAccountHasRole")
const alertService = require("./services/alert")
const paymentService = require("./services/payment")
const mailerService = require("./services/mailer")

require('dotenv').config()

const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur

const connectionString = "postgres://user1:root@localhost/base1"
const db = new pg.Pool({ connectionString: connectionString })

// creation variable service

mailer = require('express-mailer');
app.engine('html', swig.renderFile)
app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
app.set('view engine', 'html');

mailer.extend(app, {
    from: 'projet.hova.esimed@gmail.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'projet.hova.esimed@gmail.com',
        pass: 'Projethova*'
    }
});


const itemS = new itemService(db)
const listS = new listService(db)
const userAccountS = new userAccountService(db)
const partageListS = new partageListService(db)
const roleS = new roleService(db)
const userAccountHasRoleS = new userAccountHasRoleService(db)
const alertS = new alertService(db)
const paymentS = new paymentService(db)
const mailerS = new mailerService()

const jwt = require('./jwt')(userAccountS, userAccountHasRoleS)

//appel de mes routes api
require('./api/mailer')(app, mailerS)

require('./api/list')(app, listS, partageListS,alertS,userAccountHasRoleS, jwt)
require('./api/item')(app, itemS, listS,alertS, jwt)
require('./api/useraccount')(app, userAccountS, jwt)
require('./api/partageList')(app, partageListS,userAccountHasRoleS, jwt)
require('./api/role')(app, roleS, jwt)
require('./api/alert')(app, alertS, jwt)
require('./api/payment')(app, paymentS,userAccountHasRoleS,alertS, jwt)


require('./datamodel/seeder')(listS,itemS, userAccountS, partageListS,roleS,userAccountHasRoleS,alertS,paymentS)
    .then(app.listen(3333))
    .catch(err => console.log(err))


