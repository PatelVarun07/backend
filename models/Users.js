const mongoose = require("mongoose");
const { Schema } = mongoose;

const usreSchema = new Schema({
	username: {
		type: String,
		require: true,
		unique: true,
	},
	email: {
		type: String,
		require: true,
		unique: true,
	},
	password: {
		type: String,
		require: true,
		unique: true,
	},
	verification: {
		type: Boolean,
		default: false,
		required: true,
	},
});
const Users = mongoose.model("users", usreSchema);
module.exports = Users;
