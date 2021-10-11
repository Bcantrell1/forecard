import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const configFirebase = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
};

//Confirm initialization is called only once.
if (!firebase.apps.length) {
    firebase.initializeApp(configFirebase);
}

// Database functions
export const storage = firebase.storage();
export const firestoreDb = firebase.firestore();

// Authentication
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// User Functions
export const getUserByUsername = async () => {
    const userCollection = firestoreDb.collection('users');
    const findUsername = userCollection
        .where('username', '==', username)
        .limit(1);
    const queryDoc = (await findUsername.get()).docs[0];
    return queryDoc;
};
