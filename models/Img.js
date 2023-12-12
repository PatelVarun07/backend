const mongoose = require('mongoose')
const {
     Schema
} = mongoose;
const imgSchema = new Schema({
     user: {
          type : mongoose.Schema.ObjectId,
          ref: 'notes',
     },
     img:{
          type : String , 
          
     },
})
const Users = mongoose.model('img', imgSchema)
module.exports = Users;