const express = require("express");
const routes = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const store = require("../middleware/multer");
const fs = require("fs");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

routes.get("/fetch-specific-note/:id", fetchuser, async (req, res) => {
	// this syntax is used to get the notes added by the user
	try {
		let note = await Notes.findById(req.params.id);

		res.json(note);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal Server Error");
	}
});
// ? ROUTES :: 1 ==> THIS ROUTES IS USED TO FETCH ALL THE NOTES WHICH IS ADD BY THE USER INTO THE DATA BASE THIS USES THE GET REQUEST COZ WE ARE GATTING THE DATA AND THIS PROCESS IS DONE BY ALL THE AUTHETICATIONS
// now we create a end point related to geting a users note
// img storage path
const imgconfig = multer.memoryStorage({
	destination: function (req, file, callback) {
		callback(null, "");
	},
});
// img filter
const isImage = (req, file, callback) => {
	if (file.mimetype.startsWith("image")) {
		callback(null, true);
	} else {
		callback(new Error("only images is allow"));
	}
};

const upload = multer({
	storage: imgconfig,
	fileFilter: isImage,
}).fields([
	{
		name: "TitleImage",
		maxCount: 1,
	},
	{
		name: "GaleryImage",
		maxCount: 100,
	},
]);

const handleCloudUpload = async (file) => {
	const responce = await cloudinary.uploader.upload(file, {
		resource_type: "auto",
	});
	return responce;
};
routes.get("/fetchnotes", fetchuser, async (req, res) => {
	// this syntax is used to get the notes added by the user

	try {
		let note = await Notes.find({ user: req.user });

		res.json(note);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal Server Error");
	}
});

// ? ROUTES :: 2 ==> THIS ROUTES IS USED TO ADD THE NOTES  THIS IS A POST REQUEST COZ WE ARE ADDING THE  NOTE
routes.post(
	"/addnote",
	upload,
	fetchuser,

	async (req, res) => {
		// this syntax is used to add the notes which contain the id of the
		// console.log(req.files)
		// todo : use ifelse so if there is an image to hi image adding run ho
		const imagarr = req.files;
		let glaryimagepath = imagarr.GaleryImage.map((images) => images);

		try {
			cloudinary.config({
				cloud_name: "djaqgemac",
				api_key: 165246311414971,
				api_secret: "0XV_6ICyrtNUmJurmOVTSywEliw",
			});

			const TitleB64 = Buffer.from(imagarr.TitleImage[0].buffer).toString(
				"base64"
			);
			let TitledataURI =
				"data:" + imagarr.TitleImage[0].mimetype + ";base64," + TitleB64;
			const CloudTilteImage = await handleCloudUpload(TitledataURI);
			const CloudGalaryImage = [];
			for (const NewImg of glaryimagepath) {
				const galaryB64 = Buffer.from(NewImg.buffer).toString("base64");
				let GalarydataURI = "data:" + NewImg.mimetype + ";base64," + galaryB64;
				const CloudGalaryImg = await handleCloudUpload(GalarydataURI);
				console.log(CloudGalaryImg.secure_url);
				CloudGalaryImage.push(CloudGalaryImg.secure_url);
				// console.log(CloudGalaryImage)
			}

			const result = validationResult(req);
			if (!result.isEmpty()) {
				res.status(500).send("Internal Server Error");
			}

			const note = new Notes({
				user: req.user,
				title: req.body.title,
				description: req.body.description,
				tag: req.body.tag,
				TitleImage: CloudTilteImage.secure_url,
				GaleryImage: CloudGalaryImage,
			});

			const savedNote = await note.save();

			res.json(savedNote);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Internal Server Error");
		}
	}
);

// ? ROUTES :: 3 ==> THIS ROUTES IS USED TO UPDATE THE EXISTING  NOTES  THIS IS A PUT REQUEST COZ WE ARE ADDING THE  NOTE
routes.put("/update/:id", upload, fetchuser, async (req, res) => {
	// * we are writing (:id ) in the end poin url to get the id of which note is gona update and it is also usefull to find the user related to that note

	// to update not we have to firstly find that note we also have to check that the note which is going to chang is belong to the same person which created the note
	//  after all the authentication we allow the user to update the note
	// todo : agar image na ho to image addin vala code run na ho our pehale vali image deksake
	cloudinary.config({
		cloud_name: "djaqgemac",
		api_key: 165246311414971,
		api_secret: "0XV_6ICyrtNUmJurmOVTSywEliw",
	});
	console.log(req.files)
	if(!req.files == undefined){
		const imagarr = req.files;
		let glaryimagepath = imagarr.GaleryImage.map((images) => images);
		if (imagarr.TitleImage !== []) {
			const NewTitleB64 = Buffer.from(
				imagarr.TitleImage[0].buffer
			).toString("base64");
			let NewTitledataURI =
				"data:" + imagarr.TitleImage[0].mimetype + ";base64," + NewTitleB64;
				const  TitleImgResponce = await handleCloudUpload(NewTitledataURI)
				UpdateNote.TitleImage = TitleImgResponce.secure_url
		}
		if (imagarr.GaleryImage !== []) {
			const CloudGalaryImage = [];
			for (const NewImg of glaryimagepath) {
				const galaryB64 = Buffer.from(NewImg.buffer).toString("base64");
				let GalarydataURI = "data:" + NewImg.mimetype + ";base64," + galaryB64;
				const CloudGalaryImg = await handleCloudUpload(GalarydataURI);
				console.log(CloudGalaryImg.secure_url);
				CloudGalaryImage.push(CloudGalaryImg.secure_url);
				// console.log(CloudGalaryImage)
			}
			UpdateNote.GaleryImage = CloudGalaryImage
		}
	}
	
	
	
	const { etitle, edescription, etags } = req.body;
	try {
		const UpdateNote = {};
		if (etitle) {
			UpdateNote.title = etitle;
		}
		if (edescription) {
			UpdateNote.description = edescription;
		}
		if (etags) {
			UpdateNote.tag = etags;
		}
		
		let note = await Notes.findById(req.params.id);
		if (!note) {
			res.status(404).send(" Note is Not Found");
		}
		if (note.user.toString() !== req.user) {
			res.status(405).send("You Are Not Allowed To Update Note");
		}
		note = await Notes.findByIdAndUpdate(
			req.params.id,
			{
				$set: UpdateNote,
			},
			{
				new: true,
			}
		);
		res.json(note);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal Server Error");
	}
});

// ? ROUTES :: 4 ==> THIS ROUTES IS USED TO DELETE THE NOTES  THIS IS A DELETE REQUEST COZ WE ARE DELETING THE NOTE
routes.delete("/deletenote/:id", fetchuser, async (req, res) => {
	// * we are writing (:id ) in the end poin url to get the id of which note is gona delete and it is also usefull to find the user related to that note

	// to delete not we have to firstly find that note we also have to check that the note which is going to chang is belong to the same person which created the note
	//  after all the authentication we allow the user to update the note
	try {
		let note = await Notes.findById(req.params.id);
		if (!note) {
			console.error(error.message);
			res.status(404).send(" Note is Not Found");
		}
		if (note.user.toString() !== req.user) {
			console.error(error.message);
			res.status(405).send("You Are Not Allowed To Delete Note");
		}
		note = await Notes.findByIdAndDelete(req.params.id);
		res.json({
			sucsse: "the note is deleted sussce fully",
			note: note,
		});
	} catch (error) {
		// console.error(error.message);
		res.status(500).send("Internal Server Error");
	}
});

module.exports = routes;
