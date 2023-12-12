const nodemailer = require("nodemailer");
const MailTransport = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	secure: false, // upgrade later with STARTTLS
	auth: {
		user: "varun12200407@gmail.com",
		pass: "rsjf abyz ozby ofcq",
	},
});

module.exports = MailTransport;
