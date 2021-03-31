const Item = require('./model/item')
const List = require('./model/list')
const UserAccount = require('./model/userAccount')
const PartageList = require('./model/partageList')

module.exports = (listService, itemService,userAccountService, partageListService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userAccountService.dao.db.query(`CREATE TABLE ${userAccountService.dao.tablename}(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, challenge TEXT NOT NULL)`)
            await listService.dao.db.query(`CREATE TABLE ${listService.dao.tablename}(id SERIAL PRIMARY KEY, shop TEXT NOT NULL, date DATE NOT NULL, archived BOOLEAN DEFAULT FALSE, useraccount_id INTEGER REFERENCES useraccount(id))`)
            await itemService.dao.db.query(`CREATE TABLE ${itemService.dao.tablename}(id SERIAL PRIMARY KEY, id_list INTEGER REFERENCES list (id),label TEXT NOT NULL, quantity INTEGER NOT NULL, checked BOOLEAN DEFAULT FALSE, useraccount_id INTEGER REFERENCES useraccount(id))`)
            await partageListService.dao.db.query(`CREATE TABLE ${partageListService.dao.tablename}(id SERIAL PRIMARY KEY, id_list INTEGER REFERENCES list (id), useraccount_id INTEGER REFERENCES useraccount(id), edit BOOLEAN DEFAULT FALSE)`)
            // INSERTs
            const userAccount1 =  await userAccountService.insert(`User1`,"user1@exemple.fr", "ex1")
            const userAccount2 =  await userAccountService.insert(`User2`,"user2@exemple.fr", "ex2")

            for(let i=0; i<5; i++){
                const listId = await listService.dao.insert(new List(`ShopUser1${i}`, new Date(), false, userAccount1.id))
                if(i%2===0){
                    await partageListService.dao.insert(new PartageList(listId,userAccount2.id,true))
                }else {
                    await partageListService.dao.insert(new PartageList(listId,userAccount2.id,false))
                }

                for(let j=0;j<7;j++){
                    await itemService.dao.insert(new Item(listId, `LabelUser1-${j}`,j, false, userAccount1.id))
                }
            }
            for(let i=0; i<5; i++){
                const listId = await listService.dao.insert(new List(`ShopUser2${i}`, new Date(), false, userAccount2.id))
                if(i%2===0){
                    await partageListService.dao.insert(new PartageList(listId,userAccount1.id,true))
                }else {
                    await partageListService.dao.insert(new PartageList(listId,userAccount1.id,false))
                }

                for(let j=0;j<7;j++){
                    await itemService.dao.insert(new Item(listId, `LabelUser2-${j}`,j, false, userAccount2.id))
                }
            }

        } catch (e) {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                resolve()
            } else {
                reject(e)
            }
            return
        }
    })
}