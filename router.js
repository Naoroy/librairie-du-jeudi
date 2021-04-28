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
  /* Query database.books, data is stored in snapshot */
  //Books.once('value').then(snapshot => {
  //  console.log("book?")
  //  const books = []
  //  snapshot.forEach(child => {
  //    books.push({ id: child.key, ...child.val() })
  //  })
  //  res.send(books)
  //})
  //.catch(error => res.send(error))
  //if (false) {
  //  books = getBooksByID(id)
  //  console.log(id)
  //  res.send()
  //  return
  //}
  //else if (name) books = getBooksByName(name)

}

function getAllBooks() {
  return new Promise((fulfill, reject) => {
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
