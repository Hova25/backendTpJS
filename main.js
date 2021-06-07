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

const connectionString = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
const db = new pg.Pool({ connectionString: connectionString })

// creation variable service

mailer = require('express-mailer');
app.engine('html', swig.renderFile)
app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
app.set('view engine', 'html');

mailer.extend(app, {
    from: process.env.MAILER_FROM,
    host: process.env.MAILER_HOST, // hostname
    secureConnection: true, // use SSL
    port: process.env.MAILER_PORT, // port for secure SMTP
    transportMethod: process.env.MAILER_METHOD, // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_PASSWORD
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
require('./api/useraccount')(app, userAccountS,userAccountHasRoleS, jwt)
require('./api/partageList')(app, partageListS,userAccountHasRoleS,listS,userAccountS, jwt)
require('./api/role')(app, roleS, jwt)
require('./api/alert')(app, alertS, jwt)
require('./api/payment')(app, paymentS,userAccountHasRoleS,alertS, jwt)


require('./datamodel/seeder')(listS,itemS, userAccountS, partageListS,roleS,userAccountHasRoleS,alertS,paymentS)
    .then(app.listen(process.env.APP_PORT))
    .catch(err => console.log(err))


