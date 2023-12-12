const mongoose = require("mongoose");
const { Schema } = mongoose;

const notesSchema = new Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "users",
	},
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	tag: {
		type: String,
		default: "Generel",
	},
	TitleImage:{
		type: String,
	},
	GaleryImage:[{
		type: Array,
	}],
	
	date: {
		type: Date,
		default: Date.now,
	},
});
const Notes = mongoose.model("notes", notesSchema);
module.exports = Notes;
