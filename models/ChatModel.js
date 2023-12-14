const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatModelSchema = new Schema(
	{
		chatName: {
			type: String,

			trim: true,
		},
		IsGroupChat: {
			type: Boolean,

			default: false,
		},
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "users",
			},
		],
		LatestMessage: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "message",
		},
		groupAdmin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
	},
	{
		timestamps: true,
	}
);

const ChatModel = mongoose.model("chats", ChatModelSchema);
module.exports = ChatModel;
