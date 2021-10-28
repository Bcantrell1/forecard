import CreateCourse from '../../../components/CreateCourse';
import AdminCheck from '../../../components/Utilities/AdminCheck';
import { getUserByUsername, getUserUid } from '../../../lib/firebase';

export async function getServerSideProps({ params }) {
    const { username } = params;
    const userData = await getUserByUsername(username);
    const userUid = await getUserUid(username);
    let user = null;

    if (!userData && userUid) {
        return { notFound: true };
    }

    if (userData && userUid) {
        user = userData;
    }

    return {
        props: {
            user,
            username,
        },
    };
}
function Admin({ user }) {
    return (
        <AdminCheck user={user}>
            <div>
                <h1>Welcome to the Admin Page</h1>
                <CreateCourse />
            </div>
        </AdminCheck>
    );
}

export default Admin;
