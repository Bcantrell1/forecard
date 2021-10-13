import { firestoreDb, auth } from '../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import ScorecardFeed from './ScorecardFeed';

const ScorecardList = () => {
    const ref = firestoreDb
        .collection('users')
        .doc(auth.currentUser.uid)
        .collection('scorecards');
    const query = ref.orderBy('createdAt', 'desc');
    const [collection, loading, error] = useCollection(query, {
        snapshotListenOptions: { includeMetadataChanges: true },
    });
    const scorecards = collection?.docs.map((doc) => doc.data());

    return (
        <>
            {error && <strong>Error: {JSON.stringify(error)}</strong>}
            {loading && <span>Scorecards: Loading...</span>}
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
