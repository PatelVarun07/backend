const mongoose = require("mongoose");

const mongoURI =
	"mongodb+srv://varun:varun-pass@cluster0.jvywrip.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo = async () => {
	try {
		await mongoose.connect(mongoURI);
		console.log("Database Connected");
	} catch (error) {
		console.log("some erroe occured while connection to database" , error);
	}
};

module.exports = connectToMongo;
