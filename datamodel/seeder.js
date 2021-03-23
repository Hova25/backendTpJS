const Item = require('./model/item')
const List = require('./model/list')

module.exports = (listService, itemService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await listService.dao.db.query(`CREATE TABLE ${listService.dao.tablename}(id SERIAL PRIMARY KEY, shop TEXT NOT NULL, date DATE NOT NULL, archived BOOLEAN DEFAULT FALSE)`)
            await itemService.dao.db.query(`CREATE TABLE ${itemService.dao.tablename}(id SERIAL PRIMARY KEY, id_list INTEGER,label TEXT NOT NULL, quantity INTEGER NOT NULL, checked BOOLEAN DEFAULT FALSE,  CONSTRAINT fk_list_id FOREIGN KEY (id_list) REFERENCES list (id))`)
            // INSERTs
            for(let i=0; i<5; i++){
                const listId = await listService.dao.insert(new List(`Shop${i}`, new Date(), false))
                for(let j=0;j<7;j++){
                    await itemService.dao.insert(new Item(listId, `Label-${j}`,j, false))
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