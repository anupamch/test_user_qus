const {
    USERS,
    CATEGORIES,
    QUESTIONS
} = require("../collections")
let default_data = require("./data.js") 
function findUser(db,query){
    console.log(query)
    return db.collection(USERS).findOne(query)
}
function updateUser(db,query,udata){
    //console.log(udata)
    const update_data = {"$set":udata}
    return db.collection(USERS).updateOne(query,update_data)
}

function findCategory(db,query){
    //console.log(query)
    return db.collection(CATEGORIES).find(query).toArray()
}
function saveQusBulk(db,data){
    
    return db.collection(QUESTIONS).insertMany(data)
}

function getQuetions(db,data){
    return db.collection(QUESTIONS).aggregate([ 
        {
           $lookup:
              {
                 from: "categoris",
                 localField: "cat_id",
                 foreignField: "_id",
                 as: "qusDoc"
              }
        },
       
        {
           $project:
              {
                _id:1,
                qus:1,
                name: 1,
                cat_id:1
              }
        }]
     ).toArray()
    //return db.collection(QUESTIONS).insertMany(data)
}
function saveBulk(db,cname,data){
    
    return db.collection(cname).insertMany(data)
}

async function createCollection(db){
    //console.log(await checkCollectionExist(db,"users"))
    if(await checkCollectionExist(db,USERS)<0){
     db.createCollection(USERS).then(async function(res) {
         
         console.log("User Collection created!");

         await saveBulk(db,USERS,default_data.user_data)
       });
    }else{
        console.log("User already there");
    }
    if(await checkCollectionExist(db,CATEGORIES)<0){
     db.createCollection(CATEGORIES).then(async function(res) {
         
         console.log("categories Collection created!");
         await saveBulk(db,CATEGORIES,default_data.categories)
       });
    }
    if(await checkCollectionExist(db,QUESTIONS)<0){
     db.createCollection(QUESTIONS).then(async function(res) {
         
         console.log("questions Collection created!");
         
       });
    }
 } 
 async function checkCollectionExist(db,cname){
    let collection_list = await db.listCollections().toArray()
    //console.log(collection_list)
    return collection_list.findIndex((item)=>{
         return item.name==cname
    });
 }

module.exports = {findUser,updateUser,findCategory,saveQusBulk,getQuetions,createCollection}