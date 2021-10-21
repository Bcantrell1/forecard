import AuthCheck from '../../components/AuthCheck';
import ScorecardList from '../../components/ScorecardList';
import NewScorecard from '../../components/NewScorecard';
import { UserProfile } from '../../components/UserProfile';
import { getUserByUsername } from '../../lib/firebase';

export async function getServerSideProps({ query }) {
    let user = null;
    const { username } = query;
    const userData = await getUserByUsername(username);
    if (!userData) {
        return { notFound: true };
    }

    if (userData) {
        user = userData;
    }

    return {
        props: {
            user,
        },
    };
}

const UserProfilePage = ({ user }) => {
    return (
        <main>
            <AuthCheck user={user}>
                <UserProfile user={user} />
                <NewScorecard />
                <ScorecardList />
            </AuthCheck>
        </main>
    );
};

export default UserProfilePage;
