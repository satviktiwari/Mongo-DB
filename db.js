const {MongoClient} = require('mongodb') 

let dbConnection
let link = 'Add your link';

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(link)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch( (err) => {
            console.log(err)
            return cb(err)
        })
    },
    getDb: () => dbConnection
}