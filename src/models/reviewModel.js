const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({
  
   bookId: {
       type:ObjectId,
       required:true,
       ref: "createBook"},

    reviewedBy: {
        type:String, 
        required:true,
        default: 'Guest',
        value:String
    },

    reviewedAt: {
        type:Date,
        required:true
    },

    rating: {
        type: Number,
        required:true
    },

    review: {
        type:String
    },

    isDeleted: {
        type:Boolean,
        default: false
    },
    
  },)

  module.exports = mongoose.model('reviewBook', reviewSchema)




// const sentnce = data.fullName
//             let FirstCaptal = convertFirstLetterToUpperCase(sentnce)
//             function convertFirstLetterToUpperCase(sentnce) {
//                 var splitStr = sentnce.toLowerCase().split(' ');
//                 for (var i = 0; i < splitStr.length; i++) {
//                     splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
//                 }
//                 return splitStr.join(' ');
//             }