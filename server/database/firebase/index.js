import admin from 'firebase-admin'
import serviceAccount from './admin.json'

let API

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://iceandfire-d76e1.firebaseio.com/`
})

API = process.__API__ = admin.database()

export default API