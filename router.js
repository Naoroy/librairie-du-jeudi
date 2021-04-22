const db = require('./firebase_connect')
module.exports = require('express').Router()
  .get('/',           toDo)
  .get('/books',      getBooks)
  .get('/book:id',    toDo)
  .post('/book',      toDo)
  .put('/book:id',    toDo)
  .delete('/book:id', toDo)


function getBooks(req, res) {
  /* Query database.books */
  db.ref('books').once('value').then(snapshot => {
    const books = []

    snapshot.forEach(child => {
      const bookID = child.key
      const bookData = child.val()

      books.push({ id: bookID, ...bookData })
    })

    res.send({books})
  })
  .catch(error => console.log(error))
}

function toDo(req, res) {
  res.send({
    routes: {
      books: [
          'GET    /books',
          'GET    /book/[id]',
          'POST   /book/[id]',
          'PUT    /book/[id]',
          'DELETE /book/[id]',
        ]
    }
  })
}


