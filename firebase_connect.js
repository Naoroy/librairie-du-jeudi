const firebase = require('firebase-admin')
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN)


firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://librairie-du-jeudi-default-rtdb.europe-west1.firebasedatabase.app",
})

module.exports = firebase.database()

