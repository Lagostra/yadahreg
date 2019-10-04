import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
    constructor() {
        app.initializeApp(config);

        this.auth = app.auth();
        this.emailAuthProvider = app.auth.EmailAuthProvider;
        this.db = app.database();

        this.googleProvider = new app.auth.GoogleAuthProvider();
        this.facebookProvider = new app.auth.FacebookAuthProvider();
    }

    // ****** Auth API ********

    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);

    doSignInWithGoogle = () =>
        this.auth.signInWithPopup(this.googleProvider);

    doSignInWithFacebook = () =>
        this.auth.signInWithPopup(this.facebookProvider);

    doSignOut = () => this.auth.signOut();

    doPasswordReset = email =>
        this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    // *** Merge Auth and DB User API *** //
    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
                    .once('value')
                    .then(snapshot => {
                        const dbUser = snapshot.val();

                        if (!dbUser) {
                            authUser = {
                                uid: authUser.uid,
                                email: authUser.email,
                                permissions: {},
                            };
                            next(authUser);
                            return;
                        }

                        if (dbUser.role) {
                            this.permissionsOfRole(dbUser.role)
                                .once('value')
                                .then(snapshot2 => {
                                    let permissions = snapshot2.val();
                                    if (!permissions) {
                                        permissions = {};
                                    }
                                    // merge auth and db user
                                    authUser = {
                                        uid: authUser.uid,
                                        email: authUser.email,
                                        permissions,
                                        ...dbUser,
                                    };
                                    next(authUser);
                                });
                        }
                    });
            } else {
                fallback();
            }
        });

    // ******* User API *********
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');

    // ****** Role and Permissions API ********
    roles = () => this.db.ref('roles');
    role = uid => this.db.ref(`roles/${uid}`);
    permissions = () => this.db.ref('permissions');
    permissionsOfRole = role =>
        this.db.ref(`roles/${role}/permissions`);

    // ******* Member API *********
    member = id => this.db.ref(`members/${id}`);
    members = () => this.db.ref('members');

    // ****** Event API **********
    event = id => this.db.ref(`events/${id}`);
    events = () => this.db.ref('events');
    eventTypes = () => this.db.ref('event_types');

    // ****** Semester API **********
    semester = id => this.db.ref(`semesters/${id}`);
    semesters = () => this.db.ref('semesters');
}

export default Firebase;
