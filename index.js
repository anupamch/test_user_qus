const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const { connetDb } = require("./db/connection")
const cors = require("cors")
require("dotenv").config()
const app = express();
const {router} = require("./routes/router")
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
const mongo_query = require("./db/query.js")
const port = process.env.PORT || 3000
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


// Serve Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec,{ explorer: true }));

app.use(router)
app.use(cors())
app.use(express.static("uploads"));
// Your API routes go here
connetDb().then(async (client) => {
    
        console.log("DB connected properly")
        
        app.request.db = client.db()
        await mongo_query.createCollection(app.request.db)
        app.listen(port, () => {
            console.log("Server is running on port 3000");
            console.log(`**** Sagger URL: http://localhost:${port}/api-docs ****`)
            console.log("****Two user will be created - ****")
            console.log("**** 1. username: john, password: user1 ****")
            console.log("**** 1. username: honey, password: user2 ****")
        });
    

}).catch(e=>{
    console.log("****Connection fail- CREATE DB 'ws_task_db' and start server****")
    
    console.log(e.stack)
})

