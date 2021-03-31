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



    app.get('/useraccount/myaccount', jwt.validateJWT, (req,res)=>{
        if(req.user!==undefined || req.user!==null){
            res.json({"id":req.user.id,"displayname":req.user.displayname,"login":req.user.login})
        }else{
            res.status(400).end()
            return
        }
    })

    app.get('/useraccount/checklogin',async (req,res)=>{
        const login = req.query.login
        if(login===undefined){
            res.status(400).end()
            return
        }
        if(login!==undefined || login!==null){
            const user = await service.dao.getByLogin(login)
            if(user===undefined){
                res.status(200).end()
            }else{
                res.status(401).end()
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