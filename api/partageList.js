const utile = require('./utile')()

module.exports = (app, service, jwt) => {
    const url = "/partagelist"
    app.get(`${url}`, jwt.validateJWT,async (req, res) => {
        res.json(await service.dao.getAll(req.user))
    })

    app.get(`${url}/:id_list`, jwt.validateJWT, async (req, res) => {
        try{
            const partagedList = await service.dao.getByListIdAndOwnerId( req.params.id_list, req.user.id)
            if(partagedList.length === 0){
                res.status(404).end()
                return
            }
            return res.json(partagedList)
        }
        catch (e) {
            res.status(400).end()
        }
    })

    app.patch(`${url}/:partageListId`,jwt.validateJWT, async (req, res) => {
        try{
            const partageListId = req.params.partageListId
            const prevPartageList = await service.dao.getById(partageListId)
            utile.verifByOwner(req,res,prevPartageList)

            service.dao.updateEdit(prevPartageList)
                .then(res.status(200).end())
                .catch(err => {
                    console.log(err)
                    res.status(500).end()
                })
        }catch (err) {
            console.log(err)
            res.status(400).end
        }
    })

}