module.exports = class Alert {
    constructor(useraccount_id,title, text, date, checked) {
        this.id = null
        this.useraccount_id = useraccount_id
        this.title = title
        this.text = text
        if(date===undefined){
            this.date = new Date().toISOString()
        }else{
            this.date = date
        }
        if(checked!==undefined && (checked === true || checked === "true")){
            this.checked = true
        }else{
            this.checked = false
        }
    }


}