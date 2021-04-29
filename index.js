require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const router = require('./router')
const PORT = process.env.PORT || 3003

app.use(cors())
app.use(express.json())
//app.use(helmet)
app.use(router)

app.listen(PORT)
console.log('listening on http://localhost:' + PORT)

