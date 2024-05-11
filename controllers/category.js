const mongo_query = require("../db/query.js")
const log4js = require('log4js');
const logger = log4js.getLogger();
const ObjectId = require("mongodb").ObjectId

async function getCategory(req, res) {
    
    const response_body = {
        success: true,
        status: 200
    }
    try {
        const categories = await mongo_query.findCategory(req.db,{})
        response_body.data = categories
    } catch (e) {
        response_body.status = 500
        response_body.success = false
        console.log(e.stack)
    }
    res.status(response_body.status).send(response_body)
}
module.exports = { getCategory}