const functions = require('firebase-functions');
const admin = require('firebase-admin');

const db = admin.database();
const firestore = admin.firestore();

const backupDatabase = context => {
    const db_root = db.ref('/');
    firestore
        .collection('backup')
        .doc(new Date().toISOString())
        .set(db_root.toJSON());
};

exports.scheduledFunctionCrontab = functions.pubsub
    .schedule('0 0 * * *')
    .timeZone('Norway/Oslo') // Users can choose timezone - default is America/Los_Angeles
    .onRun(context => backupDatabase);
