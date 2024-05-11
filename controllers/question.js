const mongo_query = require("../db/query.js")
const log4js = require('log4js');
const logger = log4js.getLogger();
const ObjectId = require("mongodb").ObjectId

async function insertQuestions(req, res) {
    
    const response_body = {
        success: true,
        status: 200
    }
    try {
        let bulk_qus = req.body.questions
        const qus = await mongo_query.saveQusBulk(req.db,bulk_qus)
        console.log(qus)
        if(qus)
           response_body.message = "Question inserted successfully"
        else{
            response_body.status = 500
            response_body.success = false
            response_body.message = "Fail to insert"
        }
    } catch (e) {
        response_body.status = 500
        response_body.success = false
        console.log(e.stack)
    }
    res.status(response_body.status).send(response_body)
}

async function getQuestions(req, res){
    const response_body = {
        success: true,
        status: 200
    }
    try {
        
        const qus = await mongo_query.getQuetions(req.db)
       if(qus && Array.isArray(qus)){
        response_body.data = qus
        response_body.count = qus.length
       }else{
        response_body.status = 500
        response_body.success = false
        response_body.message = "Someting wrong,try again later!!"
        
       }
    } catch (e) {
        response_body.status = 500
        response_body.success = false
        console.log(e.stack)
    }
    res.status(response_body.status).send(response_body)
}
module.exports = { insertQuestions,getQuestions}