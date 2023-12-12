const mongoose = require('mongoose')
const {
     Schema
} = mongoose;

const ForgotPasswordSchema = new Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
	},
	forgotpasstoken: {
		type: String,
		require: true,
	},
	createdAt: {
		type: Date,
		expires: 3600,
		default: Date.now(),
	},
});
const ForgotPassword = mongoose.model(' ForgotPassword', ForgotPasswordSchema)
module.exports = ForgotPassword;