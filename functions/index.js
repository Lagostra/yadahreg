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

// const db = admin.database();
// const firestore = admin.firestore();

// const backupDatabase = () => {
//     const db_root = db.ref('/');
//     firestore
//         .collection('backup')
//         .doc(new Date().toISOString())
//         .set(db_root.toJSON());
// };

// exports.backupDatabase = functions.pubsub
//     .schedule('0 0 * * *')
//     .timeZone('Norway/Oslo') // Users can choose timezone - default is America/Los_Angeles
//     .onRun(() => backupDatabase);

/*exports.deleteUserUponAuthDeletion = functions.auth
    .user()
    .onDelete(user => {
        admin
            .database()
            .ref(`/users/${user.uid}`)
            .remove();
    });*/
