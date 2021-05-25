const sha1 = require('js-sha1');

module.exports = class UserAccount {
    constructor(displayname, login, challenge, active) {
        this.id = null
        this.displayname = displayname
        this.login = login
        this.challenge = challenge
        if(active!==undefined && (active === true || active === "true")){
            this.active = true
        }else{
            this.active = false
        }
        this.setConfirmationCode()
        this.setPasswordCode()
    }

    setConfirmationCode(){
        let today = new Date();
        let dateJplus1 = new Date();
        dateJplus1.setDate(today.getDate()+1)

        this.confirmation_code = `${sha1(`${this.displayname}${this.login}confirmationcode`)}--${dateJplus1.getTime()}`
    }

    setPasswordCode(){
        let today = new Date();
        let datePlus30Min = today.getTime()+1800000;
        this.password_code = `${sha1(`${this.displayname}${this.login}setpassword`)}--${datePlus30Min}`
    }
}