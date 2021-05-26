module.exports = () => {
    return {
        verif(req, res, item) {
            if (item === undefined) {
                return res.status(404).end()
            }
            if (item.useraccount_id !== req.user.id) {
                return res.status(403).end()
            }
        },
        verifByOwner(req, res, item) {
            if (item === undefined) {
                return res.status(404).end()
            }
            if (item.owneruser_id !== req.user.id) {
                return res.status(403).end()
            }
        },
        verifByID(req, res, item) {
            if (item === undefined) {
                return res.status(404).end()
            }
            if (item.id !== req.user.id) {
                return res.status(403).end()
            }
        },
        verifAdminRole(req, res) {
            let test = 0
            req.user.roles.forEach(role => {
                if(role.name===process.env.ADMIN_ROLE_NAME){
                    test++
                }
            })
            if(test===0){
                return res.status(401).end()
            }
            return test
        },
        getSiteBaseUrl(){
            return "http://localhost:63342/tp01frontF/"
        },
        async insertAlertModificationList(id_list,current_user,listService, alertService,Alert){
            let list = await listService.dao.getById(id_list)
            if(list.useraccount_id !== current_user.id) {
                await alertService.dao.insert(new Alert(list.useraccount_id, `Une liste a été modifié `, `Votre liste : ${list.shop} a été modifié par ${current_user.displayname}`))
            }
        }

    }
}