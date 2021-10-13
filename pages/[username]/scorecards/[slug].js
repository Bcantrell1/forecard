import AuthCheck from '../../../components/AuthCheck';
import { getUserByUsername, scorecardToJSON } from '../../../lib/firebase';

export async function getServerSideProps({ params }) {
    const { username, slug } = params;
    const userData = await getUserByUsername(username);
    if (!userData) {
        return { notFound: true };
    }
    let user = null;
    let scorecard = null;

    if (userData) {
        user = userData.data();
        const scorecardRef = userData.ref.collection('scorecards').doc(slug);
        scorecard = scorecardToJSON(await scorecardRef.get());
    }

    return {
        props: {
            user,
            slug,
            scorecard,
        },
    };
}

const Scorecard = ({ user, slug, scorecard }) => {
    return scorecard ? (
        <div>
            <AuthCheck user={user}>
                <h1>{slug}</h1>
                <div>Scorecard Data Here</div>
                <div>{JSON.stringify(scorecard)}</div>
            </AuthCheck>
        </div>
    ) : null;
};

export default Scorecard;
