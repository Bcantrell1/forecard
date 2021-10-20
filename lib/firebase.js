import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
    getFirestore,
    collection,
    getDocs,
    query,
    limit,
    where,
} from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';

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
const firebaseApp = initializeApp(configFirebase);

// Database functions
export const firestore = getFirestore(firebaseApp);
export const serverTimeStamp = serverTimestamp();

// Authentication
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();

// User Functions
export const getUserByUsername = async (username) => {
    const user = [];
    const userCollection = collection(firestore, 'users');
    const findUsername = query(
        userCollection,
        where('username', '==', username),
        limit(1)
    );
    const queryDoc = await getDocs(findUsername);
    queryDoc.forEach((doc) => user.push(doc.data()));
    console.log(user);
    return user[0];
};

export const getUserUid = async (username) => {
    const uid = [];
    const userCollection = collection(firestore, 'users');
    const findUsername = query(
        userCollection,
        where('username', '==', username),
        limit(1)
    );
    const queryDoc = await getDocs(findUsername);
    queryDoc.forEach((doc) => uid.push(doc.id));
    return uid[0];
};

export function scorecardToJSON(doc) {
    const data = doc.data();
    return {
        ...data,
        createdAt: data.createdAt.serverTimeStamp,
        updatedAt: data.updatedAt.serverTimeStamp,
    };
}
