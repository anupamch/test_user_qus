var MongoClient = require('mongodb').MongoClient;
require("dotenv").config()
var url = process.env.MONGODB_URI


function connetDb(){
    console.log("Mongodb connection.....")
  
    return MongoClient.connect(url)

    
}

module.exports={ connetDb }
