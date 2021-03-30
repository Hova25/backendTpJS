module.exports = (app, service, jwt) => {
    app.post('/useraccount/authenticate', (req,res) => {
        const {login, password} = req.body
        if((login === undefined)|| (password === undefined)){
            res.status(400).end()
            return
        }
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
    })

    app.get('/useraccount/myaccount', jwt.validateJWT, (req,res)=>{
        if(req.user!==undefined || req.user!==null){
            res.json({"id":req.user.id,"displayname":req.user.displayname,"login":req.user.login})
        }else{
            res.status(400).end()
            return
        }
    })

}