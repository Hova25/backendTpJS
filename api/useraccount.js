const UserAccount = require("../datamodel/model/userAccount")

module.exports = (app, service, jwt) => {
    function validatePassword(res, req, login, password){
        service.validatePassword(login,password)
            .then(authenticated => {
                if(!authenticated){
                    res.status(401).end()
                    return
                }
                res.json({'token': jwt.generateJWT(login)})
            })
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    }

    app.post('/useraccount/authenticate', (req,res) => {
        const {login, password} = req.body
        if((login === undefined)|| (password === undefined)){
            res.status(400).end()
            return
        }
        validatePassword(res,req,login,password)
    })

    app.patch("/useraccount/update_validation/:confirmation_code", async (req, res) => {
        try{
            const prevAccount = await service.dao.getByPropertyNameAndValue("confirmation_code",req.params.confirmation_code, false, false)
            if(prevAccount.length===0){
                res.status(404).end()
            }
            const confirmationCode = req.params.confirmation_code.split("--")
            if(Date.now()<=confirmationCode[1]){
                service.dao.updateValidation(req.params.confirmation_code)
                    .then(res.status(200).end())
                    .catch(err => {
                        console.log(err)
                        res.status(500).end()
                    })
            }else{
                res.status(401).end()
            }
        }catch (err) {
            console.log(err)
            res.status(400).end()
        }
    })
    app.patch("/useraccount/update_confirmation_code/:login", async (req, res) => {
        try{
            let prevAccount = await service.dao.getByPropertyNameAndValue("login",req.params.login, false, false)
            if(prevAccount.length>0){
                prevAccount = prevAccount[0]
            }
            service.dao.updateConfirmationCode(prevAccount)
                .then(res.status(200).end())
                .catch(err => {
                    console.log(err)
                    res.status(500).end()
                })
        }catch (err) {
            console.log(err)
            res.status(400).end()
        }
    })
    app.patch("/useraccount/update_password_code/:login", async (req, res) => {
        try{
            let prevAccount = await service.dao.getByPropertyNameAndValue("login",req.params.login, false, false)
            if(prevAccount.length>0){
                prevAccount = prevAccount[0]
            }
            service.dao.passwordUpdateCode(prevAccount)
                .then(res.status(200).end())
                .catch(err => {
                    console.log(err)
                    res.status(500).end()
                })
        }catch (err) {
            console.log(err)
            res.status(400).end()
        }
    })
    app.post("/useraccount/update_password", async (req,res)=> {
        try{
            let prevAccount = await service.dao.getByPropertyNameAndValue("password_code",req.body.password_code, false, false)
            if(prevAccount.length>0){
                prevAccount = prevAccount[0]
            }else{
                res.status(404).end()
            }
            if(req.body.challenge!==undefined){
                service.updatePassword(prevAccount.login, req.body.challenge)
            }else{
                res.status(400).end()
            }

        }catch (err){
            console.log(err)
            res.status(400).end()
        }
    })



    app.get('/useraccount/myaccount', jwt.validateJWT, (req,res)=>{
        if(req.user!==undefined || req.user!==null){
            res.json({"id":req.user.id,"displayname":req.user.displayname,"login":req.user.login})
        }else{
            res.status(400).end()
            return
        }
    })
    app.get("/useraccount/get/:id", async (req, res) => {
        try {
            const useraccount = await service.dao.getById(req.params.id)
            useraccount.challenge = undefined
            return res.json(useraccount)
        }catch (e) {
            res.status(400).end()
        }
    })
    app.get("/useraccount/get/email/:email", async (req, res) => {
        try {
            let useraccount = await service.dao.getByPropertyNameAndValue("login",req.params.email, false, false)
            useraccount = useraccount[0]
            useraccount.challenge = undefined
            return res.json(useraccount)
        }catch (e) {
            res.status(400).end()
        }
    })
    app.get("/useraccount/get/confirmation_code/:confirmation_code", async (req, res) => {
        try {
            let useraccount = await service.dao.getByPropertyNameAndValue("confirmation_code",req.params.confirmation_code, false, false)
            useraccount = useraccount[0]
            useraccount.challenge = undefined
            return res.json(useraccount)
        }catch (e) {
            res.status(400).end()
        }
    })
    app.get("/useraccount/get/password_code/:password_code", async (req, res) => {
        try {
            let useraccount = await service.dao.getByPropertyNameAndValue("password_code",req.params.password_code, false, false)
            useraccount = useraccount[0]
            useraccount.challenge = undefined
            return res.json(useraccount)
        }catch (e) {
            res.status(400).end()
        }
    })


    app.get('/useraccount/checklogin',async (req,res)=>{
        const login = req.query.login
        if(login===undefined){
            res.status(400).end()
            return
        }
        if(login!==undefined && login!==null){
            const user = await service.dao.getByLogin(login)
            if(user===undefined){
                res.status(200).end()
            }else{
                res.status(202).end()
            }
        }else{
            res.status(400).end()
            return
        }
    })

    app.post('/useraccount/signup', (req,res)=>{
        if(req.body.displayname==='' && req.body.login==='' && req.body.challenge===''){
            res.status(400).end()
            return
        }
        service.insert(req.body.displayname, req.body.login, req.body.challenge)
            .then(_ => {
                res.json({"displayname":req.body.displayname, "login":req.body.login})
            })
            .catch(e => {
                res.status(500).end()
            })
    })

}