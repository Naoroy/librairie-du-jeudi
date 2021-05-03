const router = require('express').Router()
const db = require('./firebase_connect')
const Books = db.ref('books')

router
  .get('/',           map)
  .get('/books',      getBooks)
  .post('/book',      validateBook,
                      createBook)
  .put('/book:id',    updateBook)
  .delete('/book:id', deleteBook)


/*
 * middleware function
 * sends an error message if required fields are missing
 * from JSON object
 */
function validateBook(req, res, next) {
  const book = req.body
  const errorStack = []
  const requiredFields = {
    name: true,
    author: true,
    description: true,
    genre: true,
    date: true,
  }

  for (let key in requiredFields) {
    if (requiredFields[key] && !book[key]) {
      errorStack.push(`missing property ${key} in POST data`)
    }
  }
  if (errorStack.length > 0) {
    res.status(422).send(errorStack.join('\n'))
    return 
  }
  next()
}

/*
 * send all books as JSON response,
 * if query.id is not undefined, search books by id
 * if query.name is not undefined, search books by name
 */
function getBooks(req, res) {
  const id = req.query.id
  const name = req.query.name

  if (id) {
    getBooksByID(id)
      .then((books) => {
        res.send(books)
      })
      .catch((error) => {
        res.status(404).send({ error })
      })
  }
  else if (name) {
    getBooksByName(name)
      .then((books) => {
        res.send(books)
      })
      .catch((error) => {
        res.status(404).send({ error })
      })
  }
  else {
    getAllBooks()
      .then((books) => {
        res.send(books)
      })
      .catch((error) => res.status(404).send({ error }))
  }
}

function getAllBooks() {
  return new Promise((fulfill, reject) => {
    /* Query database.books, data is stored in snapshot */
    Books.once('value').then(snapshot => {
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
    if (bookID.length < 5) {
      reject('id too short, must be at least 5 characters')
      return
    }
    Books.once('value').then(snapshot => {
      const books = []

      snapshot.forEach(child => {
        const id = child.key
        const data = child.val()

        if (id.search(bookID) != -1) {
          books.push({ id: id, ...data })
        }
      })
      if (books.length == 0) {
          reject('book(s) not found')
      }

      fulfill(books)
    })
  })
}

function getBooksByName(bookName) {
  return new Promise((fulfill, reject) => {
    const books = []
    Books.once('value').then((snapshot) => {
      snapshot.forEach(child => {
        const book = child.val()
        const name = book.name
        if (name && name.search(bookName) != -1) {
          books.push(book)
        }
      })
      if (books.length < 1) {
        reject("no match for this name")
      }
      fulfill(books)
    })
  })
}

/*
 * add book to firebase.book
 * field "id" is created by firebase
 * the "book" object is treated like an array (Book.push)
 */
function createBook(req, res) {
  const book = req.body

  Books.push(book)
  res.send('Book succesfully added')
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
  <p style="color:green">POST /book</p>
  <p style="color:red">PUT /book</p>
  <p style="color:red">DELETE /book?id=(au moins 5 char de l'id)</p>
  `)
}


module.exports = router
