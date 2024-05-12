const router = require("express")()
const user = require("../controllers/user")
const category = require("../controllers/category")
const question = require("../controllers/question")
const multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    },
});
const maxSize = 1 * 1000 * 1000;
var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb(
            "Error: File upload only supports the " +
            "following filetypes - " +
            filetypes
        );
    },

    // mypic is the name of file attribute
}).single("profile_img");

var storage_csv = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, "uploads/csv/");
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".csv");
    },
});
const maxSize_csv = 1 * 1000 * 1000 * 1000;
var uploadCSV = multer({
    storage: storage_csv,
    limits: { fileSize: maxSize_csv },
    fileFilter: function (req, file, cb) {
        // Set the filetypes, it is optional
        var filetypes = /csv/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        if (mimetype && extname) {
            return cb(null, true);
        }

        cb(
            "Error: File upload only supports the " +
            "following filetypes - " +
            filetypes
        );
    },

    // mypic is the name of file attribute
}).single("qus_csv_file");

/**
     * @openapi
     * '/login':
     *  post:
     *     tags:
     *     - User Controller
     *     summary: Login as a user
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - username
     *              - password
     *            properties:
     *              username:
     *                type: string
     *                default: johndoe
     *              password:
     *                type: string
     *                default: johnDoe20!@
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.post("/login", user.login)

/**
     * @openapi
     * '/user/{userId}':
     *  get:
     *     tags:
     *     - User Controller
     *     summary: Get user profile
     *     parameters:
     *          - name: userId
     *            in: path
     *            description: User id
     *            required: true
     *            schema:
     *               type: string
     *          - name: AUTH-TOKEN
     *            in: header
     *            description: Authentication JWT token
     *            required: true
     *            schema:
     *               type: string
     *        
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */

router.get("/user/:userId", user.tokenValidation, user.getUser);
/**
     * @openapi
     * '/user/{userId}':
     *  patch:
     *     tags:
     *     - User Controller
     *     summary: Edit as a user profile
     *     parameters:
     *          - name: userId
     *            in: path
     *            description: User id
     *            required: true
     *          - name: AUTH-TOKEN
     *            in: header
     *            description: Authentication JWT token
     *            required: true
     *            schema:
     *               type: string
     *     requestBody:
     *      required: true
     *      content:
     *        multipart/form-data:
     *             schema:
     *                type: object
     *                required:
     *                    - name
     *                    - address
     *                    - mobile
     *                properties:
     *                  name:
     *                    type: string
     *                
     *                  address:
     *                      type: string
     *                  mobile:
     *                      type: string
     *                  profile_img:
     *                      type: file
     *                
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.patch("/user/:userId", user.tokenValidation, upload, user.update);
/**
     * @openapi
     * '/categories':
     *  get:
     *     tags:
     *     - Category Controller
     *     summary: Get all categories
     *     parameters: 
     *          - name: AUTH-TOKEN
     *            in: header
     *            description: Authentication JWT token
     *            required: true
     *            schema:
     *               type: string
     *        
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.get("/categories", user.tokenValidation, category.getCategory);
/**
     * @openapi
     * '/questions':
     *  post:
     *     tags:
     *     - Question Controller
     *     summary: Save bulk question with category
     *     parameters: 
     *          - name: AUTH-TOKEN
     *            in: header
     *            description: Authentication JWT token
     *            required: true
     *            schema:
     *               type: string
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - questions
     *            properties:
     *              questions:
     *                type: array
     *                default: [
     *                              {
     *                                   "qus":"dfsdf dsfsd sdfsdf?",
     *                                  "cat_id":"663f48418869c3e555ba2da0"
     *
     *                              }
     *                         ]
     *             
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.post("/questions", user.tokenValidation, question.insertQuestions);
/**
     * @openapi
     * '/questions':
     *  get:
     *     tags:
     *     - Question Controller
     *     summary: Get all Question along with category
     *     parameters: 
     *          - name: AUTH-TOKEN
     *            in: header
     *            description: Authentication JWT token
     *            required: true
     *            schema:
     *               type: string
     *        
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
router.get("/questions", user.tokenValidation, question.getQuestions);
router.post("/bulk-questions", user.tokenValidation, uploadCSV, question.bulkQuestions);

module.exports = { router }