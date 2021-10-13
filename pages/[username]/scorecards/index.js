import AuthCheck from '../../../components/AuthCheck';
import ScorecardFeed from '../../../components/ScorecardFeed';
import NewScorecard from '../../../components/NewScorecard';

import { firestoreDb, auth, getUserByUsername } from '../../../lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';

export async function getServerSideProps({ query }) {
    let user = null;
    const { username } = query;
    const userData = await getUserByUsername(username);

    if (!userData) {
        return { notFound: true };
    }

    if (userData) {
        user = userData.data();
    }

    return {
        props: {
            user,
        },
    };
}

const Scorecards = ({ user }) => {
    return (
        <main>
            <AuthCheck user={user}>
                <NewScorecard />
                <ScorecardList />
            </AuthCheck>
        </main>
    );
};

const ScorecardList = () => {
    const ref = firestoreDb
        .collection('users')
        .doc(auth.currentUser.uid)
        .collection('scorecards');
    const query = ref.orderBy('createdAt');
    const [value, loading, error] = useCollection(query, {
        snapshotListenOptions: { includeMetadataChanges: true },
    });

    const scorecards = value?.docs.map((doc) => doc.data());

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

export default Scorecards;
