import AuthCheck from '../../components/AuthCheck';
import ScorecardFeed from '../../components/ScorecardFeed';
import { UserProfile } from '../../components/UserProfile';
import { getUserByUsername, scorecardToJSON } from '../../lib/firebase';

export async function getServerSideProps({ query }) {
    const { username } = query;
    const userData = await getUserByUsername(username);

    if (!userData) {
        return { notFound: true };
    }
    let user = null;
    let scorecards = null;

    if (userData) {
        user = userData.data();

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

const UserProfilePage = ({ user, scorecards }) => {
    return (
        <main>
            <AuthCheck user={user}>
                <UserProfile user={user} />
                <ScorecardFeed scorecards={scorecards} />
            </AuthCheck>
        </main>
    );
};

export default UserProfilePage;
