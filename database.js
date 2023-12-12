const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://varun:varun-pass@cluster0.jvywrip.mongodb.net/?retryWrites=true&w=majority'


const connectToMongo = async () => {
     await mongoose.connect(mongoURI)
     console.log('Database Connected' )
}

module.exports = connectToMongo;