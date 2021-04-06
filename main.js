const pg = require('pg')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const itemService = require("./services/item")
const listService = require("./services/list")
const userAccountService = require("./services/userAccount")
const partageListService = require("./services/partageList")


const app = express()
app.use(bodyParser.urlencoded({ extended: false })) // URLEncoded form data
app.use(bodyParser.json()) // application/json
app.use(cors())
app.use(morgan('dev')); // toutes les requêtes HTTP dans le log du serveur

const connectionString = "postgres://user1:root@localhost/base1"
const db = new pg.Pool({ connectionString: connectionString })

// creation variable service


const itemS = new itemService(db)
const listS = new listService(db)
const userAccountS = new userAccountService(db)
const partageListS = new partageListService(db)

const jwt = require('./jwt')(userAccountS)

//appel de mes routes api
require('./api/list')(app, listS, partageListS, jwt)
require('./api/item')(app, itemS, jwt)
require('./api/useraccount')(app, userAccountS, jwt)
require('./api/partageList')(app, partageListS, jwt)


require('./datamodel/seeder')(listS,itemS, userAccountS, partageListS)
    .then(app.listen(3333))
    .catch(err => console.log(err))


