import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    limit,
    where,
    orderBy,
    updateDoc,
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

//Scorecard Functions

export const listScorecards = async (userUid) => {
    const scorecards = [];
    const ref = collection(firestore, 'users', userUid, 'scorecards');
    const listQuery = query(ref, limit(20), orderBy('createdAt', 'desc'));
    const listData = await getDocs(listQuery);

    listData.forEach((doc) => {
        scorecards.push(JSON.stringify(doc.data()));
    });
    return scorecards;
};

export const getScorecard = async (userUid, slug) => {
    const ref = doc(firestore, 'users', userUid, 'scorecards', slug);
    const scorecardInfo = await getDoc(ref);
    const data = JSON.stringify(scorecardInfo.data());
    return data;
};

export const updateScore = async (slug, score, holeId) => {
    const ref = doc(
        firestore,
        `/users/${auth.currentUser.uid}/scorecards/${slug}`
    );
    await updateDoc(ref, {
        [`content.score.${holeId}`]: score,
    });
};

//Utilities

export const queryCollection = async (path, setState) => {
    let array = [];
    const ref = collection(firestore, path);
    let refSnapshot = await getDocs(ref);
    refSnapshot.forEach((collection) => {
        array.push(collection.id);
    });
    setState(array);
};
