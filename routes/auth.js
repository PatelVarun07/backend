const express = require("express");
const { body, validationResult } = require("express-validator");
const Users = require("../models/Users");
const routes = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const JWT_SIGN = "shhhhh";
const fetchuser = require("../middleware/fetchuser");
const OneTimePass = require("../models/OneTimePass");
const generateOtp = require("../util/otpJenerater");
const MailTransport = require("../util/EmailSending");
const ForgotPassword = require("../models/ForgotPassword");
const ResetPassword = require("../middleware/ResetPassword");
const VerificationEmailBody = require("../util/EmailBody");

let success = false;

routes.post(
	"/createuser",
	[
		body("username").isLength({
			min: 3,
		}),
		body("email").isEmail(),
		body("password").isLength({
			min: 8,
		}),
	],

	async (req, res) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			res.status(500).send("Internal Server Error");
		}
		try {
			let user = await Users.findOne({
				username: req.body.username,
			});
			if (user) {
				return res
					.status(403)
					.json({ responce: "user with this username already exists" });
			}

			const salt = bcrypt.genSaltSync(10);
			const hashPass = bcrypt.hashSync(req.body.password, salt);
			user = new Users({
				username: req.body.username,
				email: req.body.email,
				password: hashPass,
			});
			// now we are generating one time pass word to authenticate the user
			const OTP = generateOtp();
			// to maintain the security of the app we also the otp  with the help of bycript
			const OtpSalt = bcrypt.genSaltSync(10);
			const HashedOTP = bcrypt.hashSync(OTP, OtpSalt);
			const OneTimePassword = new OneTimePass({
				owner: user._id,
				token: HashedOTP,
			});
			MailTransport.sendMail({
				from: "varun12200407@gmail.com",
				to: user.email,
				subject: "email verification",
				html: VerificationEmailBody(OTP),
			});

			await OneTimePassword.save();
			await user.save();
			const token = jwt.sign(
				{
					foo: user._id,
				},
				JWT_SIGN
			);
			success = true;
			res.json({
				success,
				token,
			});
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Internal Server Error");
		}
	}
);
routes.post(
	"/login",
	[body("username").exists(), body("password").exists()],
	async (req, res) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			res.status(500).send("Internal Server Error");
		}
		const { username, password } = req.body;
		try {
			let user = await Users.findOne({
				username,
			});
			if (!user) {
				return res.status(400).send("try to login  with correct credentials");
			}
			const loginPass = bcrypt.compareSync(password, user.password);
			if (!loginPass) {
				return res.status(400).send("try to login  with correct credentials");
			}
			// use this jwt syntax
			const token = jwt.sign(
				{
					foo: user._id,
				},
				JWT_SIGN
			);
			success = true;
			res.json({
				success,
				token,
			});
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Internal Server Error");
		}
	}
);
routes.post("/getuser", fetchuser, async (req, res) => {
	try {
		const userId = req.user;
		const user = await Users.findById(userId).select("-password");
		res.send(user);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal Server Error");
	}
});
routes.post(
	"/emailverification",
	[body("token").exists()],
	fetchuser,
	async (req, res) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			res.status(500).send("Internal Server Error 1223333");
		}
		const { token } = req.body;
		try {
			const newUser = await Users.findById(req.user);
			if (!newUser) {
				return res.status(400).send("try to login  with correct credentials1");
			}
			const otpOfUser = await OneTimePass.findOne({ owner: req.user });
			console.log(otpOfUser);
			if (!otpOfUser) {
				return res.status(400).send("try to login  with correct credentials2");
			}
			const CheckOTP = bcrypt.compareSync(token, otpOfUser.token);
			if (!CheckOTP) {
				return res.status(400).send("try to login  with correct credentials3");
			}

			newUser.verification = true;

			await newUser.save();
			await OneTimePass.findByIdAndDelete(otpOfUser._id);
			res.json({success});
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Internal Server Error");
		}
	}
);
routes.post("/forgetpassword", [body("email").exists()], async (req, res) => {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		res.status(500).send("Internal Server Error");
	}
	const { email } = req.body;
	try {
		let user = await Users.findOne({
			email: email,
		});
		if (!user) {
			return res.status(400).send("there is a no user with this email");
		}
		const token = await ForgotPassword.findOne({ owner: user._id });
		if (token) {
			return res
				.status(400)
				.send("there is a reset password token try again after one hour");
		}
		function generateToken(n) {
			var chars =
				"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			var token = "";
			for (var i = 0; i < n; i++) {
				token += chars[Math.floor(Math.random() * chars.length)];
			}
			return token;
		}
		const RandomToken = generateToken(50);
		const ForgotPassTokenSalt = bcrypt.genSaltSync(10);
		const HashedForgotPassToken = bcrypt.hashSync(
			RandomToken,
			ForgotPassTokenSalt
		);
		const ForgotPassToken = new ForgotPassword({
			owner: user._id,
			forgotpasstoken: HashedForgotPassToken,
		});
		await ForgotPassToken.save();
		MailTransport.sendMail({
			from: "varun12200407@gmail.com",
			to: user.email,
			subject: "email verification",
			html: `<h1>this is the mail to change your psaaword and the link is below</h1>
                    <a>http://localhost:3000/reset-password?token=${RandomToken}&id=${user._id}</a>`,
		});
		res.json({RandomToken , message:"the forget password link is send to your email"});
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal Server Error");
	}
});
routes.post(
	"/resetpassword",
	[body("password").exists()],
	ResetPassword,
	async (req, res) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			res.status(500).send("Internal Server Error");
		}
		const { password } = req.body;
		try {
			const user = await Users.findById(req.user._id);
			if (!user) {
				res.status(500).send("user dose not axiste");
			}
			const comperResetPassword = bcrypt.compareSync(password, user.password);
			if (comperResetPassword) {
				return res
					.status(400)
					.send("new password cannot be same as older password");
			}
			const NewPassSalt = bcrypt.genSaltSync(10);
			const NewHashPass = bcrypt.hashSync(req.body.password, NewPassSalt);
			user.password = NewHashPass.trim();
			await user.save();
			// await OneTimePass.findByIdAndDelete(otpOfUser._id)
			await ForgotPassword.findOneAndDelete({
				owner: user._id,
			});
			success = true
			res.json({success});
		} catch (error) {
			res.status(500).send("Internal Server Error");
		}
	}
);
routes.post("/resendotp", fetchuser, async (req, res) => {
	
	try {
		const user = await Users.findById(req.user)
		await OneTimePass.findOneAndDelete({
			owner: req.user,
		});
		console.log("coplete 1")
		
		// now we are generating one time pass word to authenticate the user
		const NewOTP = generateOtp();
		// // to maintain the security of the app we also the otp  with the help of bycript
		const NewOtpSalt = bcrypt.genSaltSync(10);
		const HashedNewOTP = bcrypt.hashSync(NewOTP, NewOtpSalt);
		const OneTimePassword = new OneTimePass({
			owner: user._id,
			token: HashedNewOTP ,
		});
		MailTransport.sendMail({
			from: "varun12200407@gmail.com",
			to: user.email,
			subject: "email verification",
			html: VerificationEmailBody(NewOTP),
		});
          console.log("coplete 2")
		
		await OneTimePassword.save();
		success = true;
		res.json({
			success,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal Server Error");
	}
});
routes.get('/getallusers' , async (req,res)=>{
	let user = await Users.find()
	res.send(user)
})

module.exports = routes;
