const sha1 = require('js-sha1');

module.exports = class UserAccount {
    constructor(displayName, login, challenge, active) {
        this.id = null
        this.displayName = displayName
        this.login = login
        this.challenge = challenge
        if(active!==undefined){
            this.active = true
        }else{
            this.active = false
        }
        let today = new Date();
        let dateJplus1 = new Date();
        dateJplus1.setDate(today.getDate()+1)

        this.confirmation_code = `${sha1(`${this.displayName}${this.login}`)}--${dateJplus1.getTime()}`
    }
}