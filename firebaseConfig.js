const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://movies-13495-default-rtdb.asia-southeast1.firebasedatabase.app/" // Sử dụng URL dự án của bạn
});

const db = admin.firestore();
module.exports = db;
