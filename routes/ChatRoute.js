const express = require("express");
const routes = express.Router();
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const ChatModel = require("../models/ChatModel");
const Users = require("../models/Users");
let success = false;

// to test this api ==> {"http://localhost:5001/api/chat/createchat"}
routes.post(
	"/createchat",
	[body("userId", "the user Id is require to create a chat").exists()],
	fetchuser,
	async (req, res) => {
		try {
			const result = validationResult(req);
			if (!result.isEmpty()) {
				res.status(500).send("Internal Server Error");
			}
			const { userId } = req.body;

			let chat = await ChatModel.find({
				IsGroupChat: false,
				$and: [
					{
						users: { $elemMatch: { $eq: userId } },
					},
					{
						users: { $elemMatch: { $eq: req.user } },
					},
				],
			})
				.populate("users", "-password")
				.populate("LatestMessage");

			chat = await Users.populate(chat, {
				path: "LatestMessage.sender",
				select: "email  username",
			});

			if (chat.length > 0) {
				res.send(chat[0]);
			} else {
				var ChatDatat = {
					chatName: "sender",
					IsGroupChat: false,
					users: [req.user, userId],
				};
				const NewChat = await ChatModel.create(ChatDatat);
				const FullChat = await ChatModel.findOne({
					_id: NewChat._id,
				}).populate("users", "-password");

				res.send(FullChat);
			}
		} catch (error) {
			res.send({
				message: "there is an error while creating a chat",
				error: error,
				success: success,
			});
		}
	}
);

// to test this api ==> {"http://localhost:5001/api/chat/fetchchat"}
routes.get("/fetchchat", fetchuser, async (req, res) => {
	try {
		let FetchChat = await ChatModel.find({
			users: { $elemMatch: { $eq: req.user } },
		})
			.populate("users", "-password")
			.populate("LatestMessage")
			.populate("groupAdmin", "-password")
			.sort({ updatedAt: -1 });

		FetchChat = await Users.populate(FetchChat, {
			path: "LatestMessage.sender",
			select: "email  username",
		});
		res.send(FetchChat);
	} catch (error) {
		res.send({
			message: "there is an error while creating a chat",
			error: error,
			success: success,
		});
	}
});
// to test this api ==> {"http://localhost:5001/api/chat/creategroupchat"}
routes.post(
	"/creategroupchat",
	[
		body("usersId", "the id of user is requir to create chat").exists(),
		body(
			"chatName",
			"the name of the chat is required to create the group chat"
		).exists(),
	],
	fetchuser,
	async (req, res) => {
		try {
			const result = validationResult(req);
			if (!result.isEmpty()) {
				res.status(500).send("Internal Server Error");
			}

			const { usersId, chatName } = req.body;
			if (usersId.length < 2) {
				res.status(400).json({
					message: "more then 2 user is required to create a group chat",
				});
			}
			const userArray = JSON.parse(usersId);
			userArray.push(req.user);
			let GroupChat = await ChatModel.create({
				chatName: chatName,
				IsGroupChat: true,
				users: userArray,
				groupAdmin: req.user,
			});

			const FullGroupChat = await ChatModel.findOne({
				_id: GroupChat._id,
			})
				.populate("users", "-psssword")
				.populate("groupAdmin", "-password");

			res.send(FullGroupChat);
		} catch (error) {
			res.send({
				message: "there is an error while creating a group chat",
				error: error,
				success: success,
			});
			console.log(error);
		}
	}
);

// to test this api ==> {"http://localhost:5001/api/chat/renamegroupchat/:id"}
routes.put("/renamegroupchat/:id", fetchuser, async (req, res) => {
	try {
		const { chatName } = req.body;

		const chat = await ChatModel.findById(req.params.id);
		if (!chat) {
			res.status(404).json({ message: "no chat found" });
		}
		let updatedChat = {};
		if (chatName) {
			updatedChat.chatName = chatName;
		}

		if (chat.groupAdmin.toString() !== req.user) {
			res.status(500).json({
				message:
					"only the admin of the user is allowed to change the name of the group",
			});
		}
		const ChatUpdate = await ChatModel.findByIdAndUpdate(
			req.params.id,
			{
				$set: updatedChat,
			},
			{
				new: true,
			}
		)
			.populate("users", "-password")
			.populate("groupAdmin", "-password");
		res.json({ message: "chat updated", ChatUpdate });
	} catch (error) {
		res.send({
			message: "there is an error while reNameing the group a chat",
			error: error,
			success: success,
		});
		console.log(error);
	}
});

// to test this api ==> {"http://localhost:5001/api/chat/addmember/:id"}
routes.put(
	"/addmember/:id",
	[
		body(
			"NewUser",
			"the id of new user is required to add it in the group"
		).exists(),
	],
	fetchuser,
	async (req, res) => {
		try {
			const result = validationResult(req);
			if (!result.isEmpty()) {
				res.status(500).send("Internal Server Error");
			}
			const { NewUser } = req.body;
			console.log(req.params.id);
			const chat = await ChatModel.findById(req.params.id);
			if (!chat) {
				res.status(404).json({ message: "no chat found" });
			}

			const AddMemberToChat = await ChatModel.findByIdAndUpdate(
				req.params.id,
				{
					$push: { users: NewUser },
				},
				{
					new: true,
				}
			)
				.populate("users", "-password")
				.populate("groupAdmin", "-password");

			res.json({ message: "chat updated", AddMemberToChat });
		} catch (error) {
			res.send({
				message: "there is an error while creating a group chat",
				error: error,
				success: success,
			});
		}
	}
);
// to test this api ==> {"http://localhost:5001/api/chat/removemember/:id"}
routes.put(
	"/removemember/:id",
	[
		body(
			"RemoveUserId",
			"the id of new user is required to add it in the group"
		).exists(),
	],
	fetchuser,
	async (req, res) => {
		try {
			const result = validationResult(req);
			if (!result.isEmpty()) {
				res.status(500).send("Internal Server Error");
			}
			const { RemoveUserId } = req.body;
			console.log(req.params.id);
			const chat = await ChatModel.findById(req.params.id);
			if (!chat) {
				res.status(404).json({ message: "no chat found" });
			}
			
			if (!chat.users.includes(RemoveUserId)) {
				res
					.status(404)
					.json({ message: "user you want to remove dose not exist" });
			} else {
				
				if (
					chat.groupAdmin.toString() !== req.user ||
					chat.groupAdmin.toString() == RemoveUserId
				) {
					res.status(500).send("not allowed");
				} else {
					const RemoveMemberFromChat = await ChatModel.findByIdAndUpdate(
						req.params.id,
						{
							$pull: { users: RemoveUserId },
						},
						{
							new: true,
						}
					)
						.populate("users", "-password")
						.populate("groupAdmin", "-password");
	
					res.json({ message: "chat updated", RemoveMemberFromChat });
				}
			}



		} catch (error) {
			res.send({
				message: "there is an error while creating a group chat",
				error: error,
				success: success,
			});
		}
	}
);
module.exports = routes;
