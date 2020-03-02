const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.createUserUponRegistration = functions.auth
    .user()
    .onCreate(user => {
        admin
            .database()
            .ref(`/users/${user.uid}`)
            .set({
                name: user.displayName,
                email: user.email,
            });
    });

const backup = require('./backup');

/*exports.deleteUserUponAuthDeletion = functions.auth
    .user()
    .onDelete(user => {
        admin
            .database()
            .ref(`/users/${user.uid}`)
            .remove();
    });*/
