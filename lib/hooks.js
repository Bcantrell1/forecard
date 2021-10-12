import { auth, firestoreDb } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read  auth record and user profile doc
export const useUserData = () => {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);
    useEffect(() => {
        let unsubscribe;
        if (user) {
            const ref = firestoreDb.collection('users').doc(user.uid);
            unsubscribe = ref.onSnapshot((doc) => {
                setUsername(doc.data()?.username);
            });
        } else {
            setUsername(null);
        }
    }, [user]);
    return { user, username };
};