import { auth, firestore } from '../lib/firebase';
import { doc, getDoc } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read  auth record and user profile doc
export const useUserData = () => {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);

    useEffect(() => {
        let unsubscribe;
        const getUserData = async () => {
            const ref = doc(firestore, 'users', user.uid);
            const docSnap = await getDoc(ref);
            if (docSnap.exists()) {
                setUsername(docSnap.data()?.username);
            } else {
                return null;
            }
        };
        if (user) {
            unsubscribe = getUserData();
        } else {
            setUsername(null);
        }
    }, [user, username]);
    return { user, username };
};
