const express = require('express')
const app = express()
const router = require('./router')
const PORT = process.env.PORT || 3003

app.use(express.json())
//app.use(helmet)
app.use(router)

app.listen(PORT)
console.log('listening on http://localhost:' + PORT)

