import AuthCheck from '../../components/Utilities/AuthCheck';
import ScorecardFeed from '../../components/Scorecard/ScorecardFeed';
import NewScorecard from '../../components/NewScorecard';
import { UserProfile } from '../../components/UserProfile';
import {
    getUserByUsername,
    getUserUid,
    listScorecards,
} from '../../lib/firebase';

export async function getServerSideProps({ params }) {
    let user = null;
    let scorecards = [];
    const { username } = params;

    const userData = await getUserByUsername(username);
    const userUid = await getUserUid(username);

    if (!userData) {
        return { notFound: true };
    }

    if (userData) {
        user = userData;
        scorecards = await listScorecards(userUid);
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
                <NewScorecard />
                <ScorecardFeed scorecards={scorecards} />
            </AuthCheck>
        </main>
    );
};

export default UserProfilePage;
