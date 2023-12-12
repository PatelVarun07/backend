const express = require('express')
const routes = express.Router()
const fetchuser = require('../middleware/fetchuser')
const Img = require('../models/Img')
const {
     body,
     validationResult
} = require('express-validator')
routes.post(
     "/",
     fetchuser,
     async (req, res) => {
          // this syntax is used to add the notes which contain the id of the 

          try {
               const {
                    img
               } = req.body
              
               const note = new Img({
                   img,
                    user: req.user
               })
               const savedNote = await note.save()

               res.json(savedNote)

          } catch (error) {
               console.error(error.message);
               res.status(500).send("Internal Server Error");
          }

     }
);
module.exports = routes