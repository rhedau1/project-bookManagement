const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
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

         let duplicateTitle = await bookModel.findOne({title:title})
         
         if(duplicateTitle) {
            return res.status(400).send({status: false, message: 'title alredy exists'})
        }
         
         //----------------------------------------------------------------------------------------excerptValidation
        if(!isValid(excerpt)) {
            return res.status(400).send({status: false, message: 'excerpt is required'})
        }
        
        //----------------------------------------------------------------------------------------userIdValidation
        if(!isValid(userId)) {
            return res.status(400).send({status: false, message: 'userId is required'})
        }

        const userNotInDB = await userModel.findById(userId) 

        if(!userNotInDB) {
            return res.status(400).send({status:false, msg: `${userId} not in DB `})
        }
        
        //----------------------------------------------------------------------------------------ISBNValidation
        if(!isValid(ISBN)) {
            return res.status(400).send({status: false, message: 'ISBN is required'})
        }
        
          //isbn validation//   will try

        let duplicateISBN = await bookModel.findOne({ISBN:ISBN})
         
         if(duplicateISBN) {
            return res.status(400).send({status: false, message: 'ISBN alredy exists'})
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

        if(!/^\d{4}-\d{2}-\d{2}$/.test(bookBody.releasedAt)) {
            return res.status(400).send({status: false, message: 'Invalid date format'})
        }


        //---------------------------------------------------------------------------------------------bookCreation
        const newBook = await bookModel.create(bookBody)
            return res.status(201).send({ status:true, data:newBook, msg: "book created successfully"})

    }
    catch(error) {
        return res.status(500).send({status: false, error: error.message})
    }
}


module.exports.createBook = createBook
