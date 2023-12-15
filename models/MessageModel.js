const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageModelSchema = new Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
		Content: {
			type: String,
			trim: true,
			
		},
		chatId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "chats",
		},
	},
	{
		timestamps: true,
	}
);

const MessageModel = mongoose.model("message", MessageModelSchema);
module.exports = MessageModel;
