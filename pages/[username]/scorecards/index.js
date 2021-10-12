import AuthCheck from '../../../components/AuthCheck';
import ScorecardFeed from '../../../components/ScorecardFeed';
import NewScorecard from '../../../components/NewScorecard';

import { getUserByUsername, scorecardToJSON } from '../../../lib/firebase';

export async function getServerSideProps({ query }) {
    let user = null;
    let scorecards = null;

    const { username } = query;
    const userData = await getUserByUsername(username);

    if (!userData) {
        return { notFound: true };
    }

    if (userData) {
        user = userData.data();

        //Temporary catch for no database field
        try {
            const scorecardQuery = userData.ref
                .collection('scorecards')
                .where('published', '==', true)
                .orderBy('createdAt', 'desc')
                .limit(5);
            scorecards = (await scorecardQuery.get()).docs.map(scorecardToJSON);
        } catch (error) {
            console.log(error);
        }
    }

    return {
        props: {
            user,
            scorecards,
        },
    };
}

const Scorecards = ({ user, scorecards }) => {
    return (
        <main>
            <AuthCheck user={user}>
                <div>Scorecards for {user.username}</div>
                <NewScorecard />
                <ScorecardFeed scorecards={scorecards} />
            </AuthCheck>
        </main>
    );
};
export default Scorecards;
