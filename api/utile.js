module.exports = () => {
    return {
        verif(req, res, item) {
            if (item === undefined) {
                return res.status(404).end()
            }
            if (item.useraccount_id !== req.user.id) {
                return res.status(401).end()
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
            return process.env.APP_FRONT_URL
        },
        async insertAlertModificationList(id_list,current_user,listService, alertService,Alert){
            let list = await listService.dao.getById(id_list)
            const text = `Votre liste : ${list.shop} a été modifié par ${current_user.displayname}`
            const alert = await alertService.dao.getByTextAndCheckedFalseAndUserAccountId(text,list.useraccount_id)
            if(list.useraccount_id !== current_user.id && alert.length === 0 ) {
                await alertService.dao.insert(new Alert(list.useraccount_id, `Une liste a été modifié `, text))
            }
        },
        async insertAlertExpireList(list,listService, alertService,Alert){
            const text = `Votre liste : ${list.shop} a périmé. Vous pouvez la supprimer ou l'archiver !`
            const alert = await alertService.dao.getByTextAndCheckedFalseAndUserAccountId(text,list.useraccount_id)
            if(alert.length === 0 ) {
                await alertService.dao.insert(new Alert(list.useraccount_id, `Une liste a périmé `, text))
            }
        },
        async verifUserCanCreateList(user,serviceList,serviceUserAccountHasRole,res){
            const userRole = await serviceUserAccountHasRole.dao.getRolesByIdUserAccount(user.id,3)
            const noArchivedList = await serviceList.dao.getAllNoArchived(user)
            if(userRole.length === 0 && noArchivedList.length >= 1 ){
                return res.status(401).end()
            }
        },
        async verifVipRole(user,serviceUserAccountHasRole,res){
            const userRole = await serviceUserAccountHasRole.dao.getRolesByIdUserAccount(user.id,3)
            if(userRole.length === 0 ){
                return res.status(401).end()
            }
        },
        array_column (input, ColumnKey, IndexKey = null) {
            if (input !== null && (typeof input === 'object' || Array.isArray(input))) {
                const newarray = []
                if (typeof input === 'object') {
                    const temparray = []
                    for (const key of Object.keys(input)) {
                        temparray.push(input[key])
                    }
                    input = temparray
                }
                if (Array.isArray(input)) {
                    for (const key of input.keys()) {
                        if (IndexKey && input[key][IndexKey]) {
                            if (ColumnKey) {
                                newarray[input[key][IndexKey]] = input[key][ColumnKey]
                            } else {
                                newarray[input[key][IndexKey]] = input[key]
                            }
                        } else {
                            if (ColumnKey) {
                                newarray.push(input[key][ColumnKey])
                            } else {
                                newarray.push(input[key])
                            }
                        }
                    }
                }
                // return Object.assign({}, newarray)
                return newarray
            }
        }

    }
}