const express = require ('express');
const router = express.Router();// Once you imported your router.js in the index, you need to tell express it can use this router
const bookController = require("../controllers/bookController");
const userController = require("../controllers/userController");
const reviewController = require("../controllers/reviewController")
const middleware = require("../middleware/auth")


router.post('/register', userController.createUser)
router.post('/login', userController.userLogin)

router.post('/books',middleware.authentication, bookController.createBook)
router.get('/books',middleware.authentication, bookController.getBooks)
router.get('/books/:bookId',middleware.authentication, bookController.getBookById)
router.put('/books/:bookId',middleware.authentication,middleware.authorisation,bookController.updateBook)
router.delete('/books/:bookId',middleware.authentication,middleware.authorisation,bookController.deleteBookById)

router.post('/books/:bookId/review', reviewController.createReview)
router.put('/books/:bookId/review/:reviewId', reviewController.updateReviews)
router.delete('/books/:bookId/review/:reviewId',reviewController.deleteReviewById)


module.exports = router 