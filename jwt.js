const jwt = require('jsonwebtoken')
const jwtKey = 'exemple cours secret key'
const jwtExpiryTokenSeconds = 3600

module.exports = (userAccountService) => {
    return {
        validateJWT(req,res, next){
          if(req.headers.authorization === undefined){
              res.status(401).end()
              return
          }
          const token = req.headers.authorization.split(" ")[1]
            jwt.verify(token, jwtKey, {algorithm:'HS256'}, async (err, token) => {
                if(err) {
                    res.status(401).end()
                    return
                }
                try {
                    req.user = await userAccountService.dao.getByLogin(token.user)
                    //verification validité de l'utilisateur
                    return next()
                }catch (e) {
                    console.log(e)
                    res.status(401).end()
                }
            })
        },
        generateJWT(user) {
            return jwt.sign({user}, jwtKey , {
                algorithm: 'HS256',
                expiresIn: jwtExpiryTokenSeconds
            })
        }
    }
}