const router = require('express').Router()
const db = require('./firebase_connect')
const Books = db.ref('books')

router
  .get('/',           map)
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
  const id = req.query.id
  const name = req.query.name

  if (id) {
    getBooksByID(id)
      .then((books) => {
        res.send(books)
      })
      .catch((error) => res.status(404).send("Not found"))
  } else {
    getAllBooks()
      .then((books) => {
        res.send(books)
      })
      .catch((error) => res.status(404).send("Not found"))
  }
  //else if (name) books = getBooksByName(name)
}

function getAllBooks() {
  return new Promise((fulfill, reject) => {
    /* Query database.books, data is stored in snapshot */
    Books.once('value').then(snapshot => {
      console.log("book?")
      const books = []
      snapshot.forEach(child => {
        books.push({ id: child.key, ...child.val() })
      })
      fulfill(books)
    })
    .catch(error => reject(error))
  })
}

function getBooksByID(bookID) {
  return new Promise((fulfill, reject) => {
    Books.once('value').then(snapshot => {
      const books = []

      snapshot.forEach(child => {
        const id = child.key
        const data = child.val()

        if (id.length < 5) return
        else if (id.search(bookID) == -1) { return }
        else { books.push({ id: id, ...data }) }
      })

      fulfill(books)
    })
  })
}

function getBooksByName(req, res) {

}

function createBook(req, res) {
  const book = req.body

  if (!book) { res.status(422).send('Missing book data') }
  else if (!book.name) { res.status(422).send('Missing field "name"') }
  else if (!book.author) { res.status(422).send('Missing field "author"') }
  else if (!book.description) { res.status(422).send('Missing field "description"') }
  else if (!book.genre) { res.status(422).send('Missing field "genre"') }
  else if (!book.date) { res.status(422).send('Missing field "date"') }
  else {
    Books.push(book)
    res.send('Book succesfully added')
  }
}

function updateBook(req, res) {

}

function deleteBook(req, res) {

}

function map(req, res) {
  res.send(`
  <p>
  <span style="color:red">à faire</span>
  <span style="color:orange">en cours</span>
  <span style="color:green">fini</span>
  </p>
  <hr>
  <p style="color:green">GET /books</p>
  <p style="color:green">GET /books?id=(au moins 5 char de l'id)</p>
  <p style="color:orange">POST /book</p>
  <p style="color:red">PUT /book</p>
  <p style="color:red">DELETE /book?id=(au moins 5 char de l'id)</p>
  `)
}


module.exports = router
