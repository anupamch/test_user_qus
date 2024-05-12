const mongo_query = require("../db/query.js")
const log4js = require('log4js');
const logger = log4js.getLogger();
const ObjectId = require("mongodb").ObjectId
const fs = require('fs');
const { parse } = require('csv-parse');

async function insertQuestions(req, res) {

    const response_body = {
        success: true,
        status: 200
    }
    try {
        let bulk_qus = req.body.questions
        const qus = await mongo_query.saveQusBulk(req.db, bulk_qus)
        console.log(qus)
        if (qus)
            response_body.message = "Question inserted successfully"
        else {
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

async function getQuestions(req, res) {
    const response_body = {
        success: true,
        status: 200
    }
    try {

        const qus = await mongo_query.getQuetions(req.db)
        if (qus && Array.isArray(qus)) {
            response_body.data = qus
            response_body.count = qus.length
        } else {
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

async function bulkQuestions(req, res) {
    const response_body = {
        success: true,
        status: 200
    }
    try {
        console.log("File reading starting...",req.file.path)
        var csvData = [];
        fs.createReadStream(req.file.path)
            .pipe(parse({ delimiter: ',',from_line: 1 }))
            .on('data', function (csvrow) {
                //console.log(csvrow);
                //do something with csvrow
                csvData.push(csvrow);
            })
            .on('end', async function () {
                //do something with csvData
               
                const qustions = await mongo_query.findCategory(req.db,{})
               
                let bulk_qs_input = []
                for (let i=1;i<csvData.length;i++) {
                    
                    let cat = qustions.find((item) => {
                        return item.name.toLowerCase() == csvData[i][1].toLowerCase()
                    })
                    bulk_qs_input.push({ qus: csvData[i][0], cat_id: cat._id.toString() })


                }
                //console.log(bulk_qs_input)
                const qus = await mongo_query.saveQusBulk(req.db, bulk_qs_input)
                //console.log(qus && qus.insertedCount>0)
                if (qus && qus.insertedCount>0)
                    response_body.message = "Question inserted successfully"
                else {
                    response_body.status = 500
                    response_body.success = false
                    response_body.message = "Fail to insert"
                }
                res.status(response_body.status).send(response_body)
                fs.unlink(req.file.path,function(err){
                    if(err) console.log(err)
                    else console.log("CSV File deleted")
                })
                
            });
            //res.status(response_body.status).send(response_body)

    } catch (e) {

        response_body.status = 500
        response_body.success = false
        response_body.message = e.message
        console.log(e.stack)
        res.status(response_body.status).send(response_body)
    }
    //res.status(response_body.status).send(response_body)
}
module.exports = { insertQuestions, getQuestions,bulkQuestions }