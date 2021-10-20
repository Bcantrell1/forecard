import { firestore, auth } from '../lib/firebase';
import { useState, useEffect } from 'react';
import ScorecardFeed from './ScorecardFeed';
import {
    orderBy,
    query,
    collection,
    limit,
    onSnapshot,
} from '@firebase/firestore';

const ScorecardList = () => {
    let [scorecards, setScorecards] = useState([]);
    const ref = collection(
        firestore,
        'users',
        auth.currentUser.uid,
        'scorecards'
    );
    const listQuery = query(ref, limit(20), orderBy('createdAt', 'desc'));

    useEffect(() => {
        onSnapshot(listQuery, (docSnap) => {
            const data = docSnap.docs.map((doc) => doc.data());
            setScorecards(data);
        });
    }, []);

    return (
        <>
            {scorecards && (
                <>
                    <h1>Your Scorecards</h1>
                    <span>
                        <ScorecardFeed scorecards={scorecards} />
                    </span>
                </>
            )}
        </>
    );
};

export default ScorecardList;
