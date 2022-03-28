const bookModel = require('../models/bookModel')
const userModel = require
const jwt = require('jsonwebtoken')

const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const createBook = async function (req, res) {
    try {
        const bookBody = req.body
        if(Object.keys(bookBody) == 0) {
            return res.status(400).send({status: false, message: 'bookDetails must be provided'})
        }

        const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = bookBody
        
         //----------------------------------------------------------------------------------------titleValidation
        if(!isValid(title)) {
            return res.status(400).send({status: false, message: 'title is required'})
        }
         //----------------------------------------------------------------------------------------excerptValidation
        if(!isValid(excerpt)) {
            return res.status(400).send({status: false, message: 'excerpt is required'})
        }

        //----------------------------------------------------------------------------------------userIdValidation
        if(!isValid(userId)) {
            return res.status(400).send({status: false, message: 'userId is required'})
        }
        
        //----------------------------------------------------------------------------------------ISBNValidation
        if(!isValid(ISBN)) {
            return res.status(400).send({status: false, message: 'ISBN is required'})
        }
        //----------------------------------------------------------------------------------------categoryValidation
        if(!isValid(category)) {
            return res.status(400).send({status: false, message: 'category is required'})
        }
        //----------------------------------------------------------------------------------------subcategoryValidation
        if(!isValid(subcategory)) {
            return res.status(400).send({status: false, message: 'subcategory is required'})
        }
        //----------------------------------------------------------------------------------------reviewsValidation
        if(!isValid(reviews)) {
            return res.status(400).send({status: false, message: 'reviews is required'})
        }
        //----------------------------------------------------------------------------------------releasedAtValidation
        if(!isValid(releasedAt)) {
            return res.status(400).send({status: false, message: 'releasedAt is required'})
        }
        //---------------------------------------------------------------------------------------------bookCreation
        const newBook = await bookModel.create(bookBody)
            res.status(201).send({ status:true, data:newBook, msg: "book created successfully"})

    }
    catch(error) {
        return res.status(500).send({status: false, error: error.message})
    }
}


module.exports.createBook = createBook