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
            console.log(req.user)
            console.log(item)
            if (item.owneruser_id !== req.user.id) {
                return res.status(403).end()
            }
        }
    }
}