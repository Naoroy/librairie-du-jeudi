const express = require('express')

module.exports = express.Router()
  .get('/',toDo )
  .get('/books', toDo)
  .get('/book:id', toDo)
  .post('/book', toDo)
  .put('/book:id', toDo)
  .delete('/book:id', toDo)


function toDo(req, res) {
  res.send(`
    <h1>ROUTES</h1>
    <ul>
      <li>get     /books</li>
      <li>get     /book/id</li>
      <li>post    /book</li>
      <li>put     /book/id</li>
      <li>delete  /book/id</li>
    </ul>
  `)

}
