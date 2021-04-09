const jwt = require('jsonwebtoken')
const jwtKey = 'myshoplist secret key'
const jwtExpiryTokenSeconds = 3600
const refreshJwtExpiryTokenSeconds = 86400

module.exports = (userAccountService, userAccountHasRoleService) => {
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
                    req.user.roles = await userAccountHasRoleService.dao.getRolesByIdUserAccount(req.user.id)
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
        },
        generateRefreshJWT(user) {
            return jwt.sign({user}, jwtKey , {
                algorithm: 'HS256',
                expiresIn: refreshJwtExpiryTokenSeconds
            })
        }
    }
}