const mongoose = require('mongoose')
const {
     Schema
} = mongoose;

const OneTimePassSchema = new Schema({
     owner:{
          type : mongoose.Schema.Types.ObjectId,
          ref: 'users',
     },
    token:{
     type:String,
     require:true,
    },
    createdAt:{
     type:Date,
     expires:3600,
     default: Date.now()
    }
});
const OneTimePass = mongoose.model('OneTimePass', OneTimePassSchema)
module.exports = OneTimePass;