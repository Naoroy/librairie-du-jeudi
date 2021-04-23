const router = require('express').Router()
const db = require('./firebase_connect')
const Books = db.ref('books')

router
  .get('/',           toDo)
  .get('/books',      getBooks)
  .post('/book',      createBook)
  .put('/book:id',    updateBook)
  .delete('/book:id', deleteBook)


/*
 * returns all books,
 * if query = id, search books by id
 * if query = name, search books by name
 */
function getBooks(req, res) {
  const id = req.params.id
  const name = req.params.name
  let books = []

  /* Query database.books, data is stored in snapshot */
  Books.once('value').then(snapshot => {
    snapshot.forEach(child => {
      books.push({ id: child.key, ...child.val() })
    })

    res.send({ books })
  })
  .catch(error => res.send(error))
  /*
  if (id) books = getBooksByID(id)
  else if (name) books = getBooksByName(name)
  else books = getAllBooks(res)
  */
}

function getAllBooks(res) {

}

function getBooksByID(res, bookID) {
  const books = []

  Books.once('value').then(snapshot => {
    snapshot.forEach(child => {
      const id = child.key
      const data = child.val()

      if (id.length < 5) return
      else if (bookID.search(id) == -1) { return }

      books.push({ id: id, ...data })
    })

  res.send({books})
  })
}

function getBooksByName(req, res) {

}

function createBook(req, res) {
  //const book = req.body.book
  const book = {
    name: 'Les malheurs de Toto',
    author: 'Toto',
    description: 'Toto nous raconte sont parcours de développeur, du lycée '+
      'jusqu\'a son poste actuel : Responsable DevOps Senior',
    genre: 'Autobiographie',
    date: Date.now()
  }
  if (!book) return res.send('data error')
  console.log(book)
  Books.push(book)
  res.send('boop')
}

function updateBook(req, res) {

}

function deleteBook(req, res) {

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


module.exports = router
