const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')

const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

/*- Add a review for the### PUT /books/:bookId
- Update a book by changing its
  - title
  - excerpt
  - release date
  - ISBN
- Make sure the unique constraints are not violated when making the update
- Check if the bookId exists (must have isDeleted false and is present in collection). If it doesn't, return an HTTP status 404 with a response body like [this](#error-response-structure)
- Return an HTTP status 200 if updated successfully with a body like [this](#successful-response-structure) 
- Also make sure in the response you return the updated book document. 
 book in reviews collection.
- Check if the bookId exists and is not deleted before adding the review. Send an error response with appropirate status code like [this](#error-response-structure) if the book does not exist
- Get review details like review, rating, reviewer's name in request body.
- Update the related book document by increasing its review count
- Return the updated book document with reviews data on successful operation. The response body should be in the form of JSON object like [this](#successful-response-structure)*/
const createReview = async function (req, res) {
    try {
        const reviewBody = req.body

        const bookId = req.params.bookId

        if(Object.keys(reviewBody) == 0) {
            return res.status(400).send({ status: false, message: 'Please provide review details' })
        }

        if (!(/^[0-9a-fA-F]{24}$/.test(bookId))) {
            return res.status(400).send({ status: false, message: 'please provide valid bookId' })
        }

        const book = await bookModel.findById(bookId)

        if (!book) {
            return res.status(404).send({ status: false, message: 'book not found' })
        }

        const { review, rating, reviewedBy, reviewedAt } = reviewBody

        if (!isValid(rating)) {
            return res.status(400).send({ status: false, message: 'rating is required' })
        }

        if (!isValid(reviewedAt)) {
            return res.status(400).send({ status: false, message: 'review date is required' })
        }

        if (!(/^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/.test(reviewedAt))) {
            return res.status(400).send({ status: false, message: 'please provide valid date in format (YYYY-MM-DD)' })
        }

        const reviewData = { bookId, rating, review, reviewedBy, reviewedAt: Date.now() }

        const addReview = await reviewModel.create(reviewData)

        book.reviews = book.reviews + 1
        await book.save()

        const data = book.toObject()
        data.reviewsData = addReview

        return res.status(201).send({ status: true, message: 'Review added successsfully', data: data })


    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createReview = createReview

