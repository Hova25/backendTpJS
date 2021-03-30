const Item = require('./model/item')
const List = require('./model/list')
const UserAccount = require('./model/userAccount')

module.exports = (listService, itemService,userAccountService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userAccountService.dao.db.query(`CREATE TABLE ${userAccountService.dao.tablename}(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, challenge TEXT NOT NULL)`)
            await listService.dao.db.query(`CREATE TABLE ${listService.dao.tablename}(id SERIAL PRIMARY KEY, shop TEXT NOT NULL, date DATE NOT NULL, archived BOOLEAN DEFAULT FALSE, useraccount_id INTEGER REFERENCES useraccount(id))`)
            await itemService.dao.db.query(`CREATE TABLE ${itemService.dao.tablename}(id SERIAL PRIMARY KEY, id_list INTEGER REFERENCES list (id),label TEXT NOT NULL, quantity INTEGER NOT NULL, checked BOOLEAN DEFAULT FALSE, useraccount_id INTEGER REFERENCES useraccount(id))`)
            // INSERTs
            const userAccount1 =  await userAccountService.insert(`User1`,"exemple1@exemple.fr", "ex1")
            for(let i=0; i<5; i++){
                const listId = await listService.dao.insert(new List(`Shop${i}`, new Date(), false, userAccount1.id))
                for(let j=0;j<7;j++){
                    await itemService.dao.insert(new Item(listId, `Label-${j}`,j, false, userAccount1.id))
                }
            }
            const userAccount2 =  await userAccountService.insert(`User2`,"exemple2@exemple.fr", "ex2")
            for(let i=0; i<5; i++){
                const listId = await listService.dao.insert(new List(`Shop${i}`, new Date(), false, userAccount2.id))
                for(let j=0;j<7;j++){
                    await itemService.dao.insert(new Item(listId, `Label-${j}`,j, false, userAccount2.id))
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