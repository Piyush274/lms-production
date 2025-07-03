const firebaseadmin = require("firebase-admin");

// Load the service account key JSON file
const serviceAccount = require("./firebase-adminsdk.json");

firebaseadmin.initializeApp({
  credential: firebaseadmin.credential.cert(serviceAccount),
});

module.exports = firebaseadmin;
