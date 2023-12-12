const multer = require("multer");


const store = (req , res , next) =>{
     const StoringMulter = multer.diskStorage({
          destination: function (req, file, cb) {
               cb(null, "uploads");
          },
          filename: function (req, file, cb) {
               var ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
               cb(null, file.fieldname + "-" + Date.now() + ext);
          },
     });
     return  multer({ storage: StoringMulter });
     next()
}
module.exports = store