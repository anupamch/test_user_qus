const md5 = require('md5');
const mongo_query = require("../db/query.js")
const log4js = require('log4js');
const logger = log4js.getLogger();
const ObjectId = require("mongodb").ObjectId
const jwt = require('jsonwebtoken');




async function login(req, res) {
        const response_body = {
                success: true,
                status: 200
        }
        try {
                const user_name = req.body.username
                const password = req.body.password
                if (user_name && password) {
                        const query = {
                                user_name: user_name,
                                password: md5(password)
                        }
                        let user = await mongo_query.findUser(req.db, query)
                        if (user) {
                                logger.info("Valid user name and password")
                                let jwtSecretKey = process.env.JWT_SECRET_KEY;
                                let data = {
                                        time: Date(),
                                        userId: user._id.toString()
                                }

                                const token = jwt.sign(data, jwtSecretKey);
                                response_body.auth_token = token

                        } else {
                                logger.info("Invalid user name and password")
                                response_body.status = 401
                        }

                } else {
                        logger.info("Required field missing")
                        response_body.status = 400
                        response_body.success = false
                }

        } catch (e) {
                logger.error("ERROR:")
                response_body.status = 500
                response_body.success = false
                console.log(e.stack)
        }
        res.status(response_body.status).send(response_body)

}

async function getUser(req, res) {
        const response_body = {
                success: true,
                status: 200
        }
        try {
                let id = req.params.userId
                const query = {
                        _id: new ObjectId(id)
                }
                let user = await mongo_query.findUser(req.db, query)
                if (user) {
                        if(user.profile_img)
                                user.profile_img = req.protocol+"://"+req.headers.host+"/"+user.profile_img
                        response_body.data = user
                } else {
                        logger.info("User not found")
                        response_body.status = 400
                        response_body.success = false
                }
        } catch (e) {
                response_body.status = 500
                response_body.success = false
                console.log(e.stack)
        }
        res.status(response_body.status).send(response_body)

}

async function update(req, res){
        const response_body = {
                success: true,
                status: 200
        }
        try {
                let file = req.file
                console.log(file)
                let update_user = {
                
                        name:req.body.name,
                        address:req.body.address,
                        mobile:req.body.mobile
                        
                }
                if(file && file.filename)
                   update_user.profile_img = file.filename
                const query = {
                        _id: new ObjectId(req.params.userId)
                }
                let user = await mongo_query.updateUser(req.db, query,update_user)
                console.log(user)
                if (user && user.matchedCount>0) {
                        response_body.message = "Update successfully"
                } else {
                        logger.info("User not found")
                        response_body.status = 400
                        response_body.success = false
                        response_body.message = "User not found!!"
                }
        } catch (e) {
                response_body.status = 500
                response_body.success = false
                console.log(e.stack)
        }
        res.status(response_body.status).send(response_body)
}




function tokenValidation(req, res, next) {
        const response_body = {
                success: true,
                status: 200
        }
        let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
        
        console.log("Validation stared")
        if (validateToken(req.header(tokenHeaderKey))) {
                logger.info("Valid token")
                //res.status(response_body.status).send(response_body)
                next()
        } else {
                logger.info("Invalid token")
                response_body.status = 401
                response_body.success = false 
                response_body.message = "Invalid token" 
                res.status(response_body.status).send(response_body)
                
        }
}


function validateToken(token) {

        console.log("In validateToken")
        let jwtSecretKey = process.env.JWT_SECRET_KEY;

        try {
                

                const verified = jwt.verify(token, jwtSecretKey);
                if (verified) {
                        return true
                } else {
                        // Access Denied
                        return false
                }
        } catch (error) {
                // Access Denied
                return false
        }
}


module.exports = { login, validateToken, tokenValidation, getUser,update }