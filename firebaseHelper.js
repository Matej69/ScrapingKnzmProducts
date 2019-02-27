module.exports = {
  SaveToFirebase
};


function SaveToFirebase(productsForSaving, accountKey, databaseURL) {
  var firebase = require("firebase-admin");

  var serviceAccount = require(accountKey);
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: databaseURL
  });

  var ref = firebase.database().ref("products");

  console.log("########### SAVING TO DATABASE--- ");
  ref.set(productsForSaving);
  console.log("########### SAVED ");

}