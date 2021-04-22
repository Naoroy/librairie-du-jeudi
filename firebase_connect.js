const firebase = require('firebase-admin')
const serviceAccount = require('./librairie-du-jeudi-firebase-adminsdk-97q9e-304aa3f5e2.json')

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://librairie-du-jeudi-default-rtdb.europe-west1.firebasedatabase.app",
})

module.exports = firebase.database()

