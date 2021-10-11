import { UserProfile } from '../../components/UserProfile';
import { getUserByUsername } from '../../lib/firebase';

export async function getServerSideProps({ query }) {
    const { username } = query;
    const userData = getUserByUsername(username);

    if (!userData) {
        return { notFound: true };
    }
    let user = null;
    let scorecards = null;

    if (userData) {
        user = (await userData).data();
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
        <div>
            <UserProfile user={user} />
        </div>
    );
};

export default UserProfilePage;
