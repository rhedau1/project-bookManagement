const express = require ('express');
const router = express.Router();// Once you imported your router.js in the index, you need to tell express it can use this router
const bookController = require("../controllers/bookController");
const userController = require("../controllers/userController");



router.post('/register', userController.createUser)
router.post('/loginUser', userController.userLogin)

router.post('/books', bookController.createBook)
router.get('/books', bookController.getBooks)


module.exports = router 