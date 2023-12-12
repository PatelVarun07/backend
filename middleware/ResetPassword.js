const Users = require("../models/Users");
const bcrypt = require('bcrypt');
const ForgotPassword = require("../models/ForgotPassword");
const { json } = require("express");
const ResetPassword = async (req , res , next)=>{
    const {token , id} = req.query
    if(!token){
     res.status(400).send("the token is invalid");
    }
    if(!id){
     res.status(400).send("the user id is invalid");
    }
    console.log(token , id , "1")
    const user = await Users.findById(id)
    if(!user){
     res.status(400).send("can not get the user");
    }
    const ResetPass = await ForgotPassword.findOne({
			owner: user._id,
		});
    console.log(ResetPass)
    console.log(token , id , "2")
    const CheckResetToken = bcrypt.compareSync(token , ResetPass.forgotpasstoken
      )
    if(!CheckResetToken){
     res.status(400).send("some error ocured while compering the token");
    }
    
    req.user = user
    next()
}

module.exports = ResetPassword