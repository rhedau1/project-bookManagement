const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')

const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

/*## Books API
### POST /books
- Create a book document from request body. Get userId in request body only.
- Make sure the userId is a valid userId by checking the user exist in the users collection.
- Return HTTP status 201 on a succesful book creation. Also return the book document. The response should be a JSON object like [this](#successful-response-structure) 
- Create atleast 10 books for each user
- Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)*/

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

/*### GET /books
- Returns all books in the collection that aren't deleted. Return only book _id, title, excerpt, userId, category, releasedAt, reviews field. Response example [here](#get-books-response)
- Return the HTTP status 200 if any documents are found. The response structure should be like [this](#successful-response-structure) 
- If no documents are found then return an HTTP status 404 with a response like [this](#error-response-structure) 
- Filter books list by applying filters. Query param can have any combination of below filters.
  - By userId
  - By category
  - By subcategory
  example of a query url: books?filtername=filtervalue&f2=fv2
- Return all books sorted by book name in Alphabatical order*/
 
   const getBooks = async  (req, res) =>{
    try {
      let filter = req.query;
      let data = await bookModel.find({isDeleted: false})
      if (data.length === 0) {
        return res.status(404).send({ status: false, msg: "No data found" })
      }
      if (filter.userId == undefined ||filter.category == undefined || filter.subcategory == undefined) {
        let books = await bookModel.find(  filter, { isDeleted: false } ).populate("userId")
        return res.status(200).send({ status:true,data: books })
      }
      if (filter.userId != undefined && filter.subcategory == undefined && filter.category == undefined) {
        let userId = filter.userId
        delete filter.userId;
        let books = await bookModel.find({ $and: [{ userId: { $in: [userId] } }, filter, { isDeleted: false }] }).populate("userId")
        return res.status(200).send({ status:true,data: books })
      }
      
      if (filter.userId == undefined && filter.subcategory == undefined && filter.category != undefined) {
        let category = filter.category
        delete filter.category;
        let books = await bookModel.find({ $and: [{ category: { $in: [category] } }, filter, { isDeleted: false }] }).populate("userId")
        return res.status(200).send({ status:true,data: books })
      }
      if (filter.userId == undefined && filter.subcategory != undefined && filter.category == undefined) {
        let subcategory = filter.subcategory
        delete filter.subcategory;
        let books = await bookModel.find({ $and: [{ subcategory: { $in: [subcategory] } }, filter, { isDeleted: false }] }).populate("userId")
        return res.status(200).send({ status:true,data: books })
      }
   
    } catch (error) {
      return res.status(500).send({ msg: "Error", error: error.message })
    }
  }







































































module.exports.createBook = createBook
module.exports.getBooks = getBooks
