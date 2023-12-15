const express = require("express");
const routes = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const ChatModel = require("../models/ChatModel");
const MessageModel = require("../models/MessageModel");
const Users = require("../models/Users");
// api testter ===> {http://localhost:5001/api/message/message}
routes.post(
	"/sendmessage",
	[
		body("content", "the content can not be null").exists(),
		body("chatId", "the chatId can not be null").exists(),
	],
	fetchuser,
	async (req, res) => {
		try {
			const result = validationResult(req);
			if (!result) {
				return res.json({ result });
			}
			const { content, chatId } = req.body;

			let Message = await MessageModel.create({
				sender: req.user,
				Content: content,
				chatId: chatId,
			});
			Message = await Message.populate("sender", "name email");
			Message = await Message.populate("Content");
			Message = await Users.populate(Message, {
				path: "chats.users",
				select: "name pic email",
			});

			await ChatModel.findByIdAndUpdate(chatId, {
				LatestMessage: Message,
			});
			res.status(200).json(Message);
		} catch (error) {
			console.log(error);
			return res
				.status(500)
				.json({ message: "there is an error while sending a message" });
		}
	}
);
routes.get("/fetchmessage/:id", fetchuser, async (req, res) => {
     try {
          let fetchMessage = await MessageModel.find({
               chatId:req.params.id
          }).populate("sender", "username pic email")
               .populate("chatId");
          res.json(fetchMessage);
	} catch (error) {
		return res
			.status(500)
			.json({ message: "there is an error while sending a message" });
	}
});
module.exports = routes;
