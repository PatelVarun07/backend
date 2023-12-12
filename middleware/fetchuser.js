var jwt = require('jsonwebtoken');
const JWT_SIGN = 'shhhhh'

const fetchuser = (req , res , next)=>{
     const token = req.header('authtoken')

     if(!token){
          return res.status(403).send('token dose not exists');
     }
     try {
          // use this in fetch user sysntax
          const data = jwt.verify(token, JWT_SIGN);
          
          req.user = data.foo;
          
          next()
     } catch (error) {
          res.status(500).send("try to login  with correct credentials");
     }
     
}

module.exports = fetchuser