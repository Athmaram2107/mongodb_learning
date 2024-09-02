const { MongoClient } = require("mongodb");

let dbConnection;
module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect("mongodb://localhost:27017/books_store")
      .then((client) => {
        dbConnection = client.db(); //to interact with database we connect.
        return cb(); //call back function
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  //sole purpose of below function is return a value which is data base connection.
  getDb: () => dbConnection,
};
