const Item = require('./model/item')
const List = require('./model/list')
const UserAccount = require('./model/userAccount')
const PartageList = require('./model/partageList')
const Role = require('./model/role')
const UserAccountHasRole = require('./model/userAccountHasRole')
const Alert = require('./model/alert')

module.exports = (listService, itemService,userAccountService, partageListService, roleService, userAccountHasRoleService, alertService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userAccountService.dao.db.query(`CREATE TABLE ${userAccountService.dao.tablename}(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, challenge TEXT NOT NULL, active BOOLEAN DEFAULT FALSE, confirmation_code TEXT NOT NULL, password_code TEXT NOT NULL)`)
            await listService.dao.db.query(`CREATE TABLE ${listService.dao.tablename}(id SERIAL PRIMARY KEY, shop TEXT NOT NULL, date DATE NOT NULL, archived BOOLEAN DEFAULT FALSE, useraccount_id INTEGER REFERENCES useraccount(id))`)
            await itemService.dao.db.query(`CREATE TABLE ${itemService.dao.tablename}(id SERIAL PRIMARY KEY, id_list INTEGER REFERENCES list (id),label TEXT NOT NULL, quantity INTEGER NOT NULL, checked BOOLEAN DEFAULT FALSE, useraccount_id INTEGER REFERENCES useraccount(id))`)
            await partageListService.dao.db.query(`CREATE TABLE ${partageListService.dao.tablename}(id SERIAL PRIMARY KEY, id_list INTEGER REFERENCES list (id), owneruser_id INTEGER REFERENCES useraccount(id),useraccount_id INTEGER REFERENCES useraccount(id), edit BOOLEAN DEFAULT FALSE)`)
            await roleService.dao.db.query(`CREATE TABLE ${roleService.dao.tablename}(id SERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL)`)
            await userAccountHasRoleService.dao.db.query(`CREATE TABLE ${userAccountHasRoleService.dao.tablename}(id_role INTEGER REFERENCES role(id),id_useraccount INTEGER REFERENCES useraccount(id))`)
            await alertService.dao.db.query(`CREATE TABLE ${alertService.dao.tablename}(id SERIAL PRIMARY KEY,useraccount_id INTEGER REFERENCES useraccount(id), title TEXT NOT NULL, text TEXT NOT NULL, date DATE NOT NULL, checked BOOLEAN DEFAULT FALSE)`)

            // INSERTs
            const role1 = await roleService.dao.insert(new Role("Utilisateur", "Utilisateur lambda") )
            const role2 = await roleService.dao.insert(new Role("Administrateur", "Administrateur lambda") )

            const userAccount1 =  await userAccountService.insert(`User1`,"user1@exemple.fr", "ex1",true)
            const userAccount2 =  await userAccountService.insert(`User2`,"user2@exemple.fr", "ex2",true)
            await userAccountService.insert(`User3`,"user3@exemple.fr", "ex3")
            await userAccountService.insert(`User4`,"user4@exemple.fr", "ex4")
            await userAccountService.insert(`User5`,"user5@exemple.fr", "ex5")
            await userAccountService.insert(`User6`,"user6@exemple.fr", "ex6")

            await userAccountHasRoleService.dao.insert(new UserAccountHasRole(role2,userAccount1.id ))


            for(let i=0; i<5; i++){
                const listId = await listService.dao.insert(new List(`ShopUser1${i}`, new Date(), false, userAccount1.id))
                if(i%2===0){
                    await partageListService.dao.insert(new PartageList(listId,userAccount1.id,userAccount2.id,true))
                }else {
                    await partageListService.dao.insert(new PartageList(listId,userAccount1.id,userAccount2.id,false))
                }

                for(let j=0;j<7;j++){
                    await itemService.dao.insert(new Item(listId, `LabelUser1-${j}`,j, false, userAccount1.id))
                }
            }
            for(let i=0; i<5; i++){
                const listId = await listService.dao.insert(new List(`ShopUser2${i}`, new Date(), false, userAccount2.id))
                if(i%2===0){
                    await partageListService.dao.insert(new PartageList(listId,userAccount2.id,userAccount1.id,true))
                }else {
                    await partageListService.dao.insert(new PartageList(listId,userAccount2.id,userAccount1.id,false))
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