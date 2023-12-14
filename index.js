const connectToMongo = require('./database')
const express = require('express')
const cors = require('cors')

connectToMongo()
const app = express()
const port = 5001;
app.use(cors())
app.use(express.urlencoded({extended : false}))
app.use(express.json())
app.use('/api/auth' , require('./routes/auth'))
app.use('/api/notes' , require('./routes/notes'))
app.use('/api/chat' , require('./routes/ChatRoute'))
app.listen(port, () => {
     console.log(`Example app listening at http://localhost:${port}`)
})