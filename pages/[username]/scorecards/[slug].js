import styles from '../../../styles/Scorecard.module.scss';
import AuthCheck from '../../../components/AuthCheck';
import {
    firestore,
    getUserByUsername,
    getUserUid,
} from '../../../lib/firebase';
import { doc, getDoc } from '@firebase/firestore';

export async function getServerSideProps({ params }) {
    const { username, slug } = params;
    const userData = await getUserByUsername(username);
    const userUid = await getUserUid(username);
    let user = null;
    let scorecard = null;

    if (!userData) {
        return { notFound: true };
    }

    if (userData) {
        user = userData;
        const ref = doc(firestore, 'users', userUid, 'scorecards', slug);
        const scorecardInfo = await getDoc(ref);
        const data = JSON.stringify(scorecardInfo.data());
        scorecard = data;
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
        <AuthCheck user={user}>
            <h1>{slug}</h1>
            <div className={styles.scorecardWrapper}>
                <article className={styles.front9}>
                    <div className={styles.hole}>
                        <span>Front</span>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                        <span>7</span>
                        <span>8</span>
                        <span>9</span>
                        <span>Out</span>
                    </div>
                    <div className={styles.par}>
                        <span>Par</span>
                        <span>3</span>
                        <span>5</span>
                        <span>4</span>
                        <span>4</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>4</span>
                        <span>4</span>
                        <span>36</span>
                    </div>
                    <div className={styles.score}>
                        <span>Score</span>
                        <span>3</span>
                        <span>5</span>
                        <span>4</span>
                        <span>5</span>
                        <span>3</span>
                        <span>3</span>
                        <span>5</span>
                        <span>4</span>
                        <span>4</span>
                        <span className={styles.sub}>36</span>
                    </div>
                </article>
                <article className={styles.back9}>
                    <div className={styles.hole}>
                        <span>Back</span>
                        <span>10</span>
                        <span>11</span>
                        <span>12</span>
                        <span>13</span>
                        <span>14</span>
                        <span>15</span>
                        <span>16</span>
                        <span>17</span>
                        <span>18</span>
                        <span>In</span>
                        <span>Total</span>
                    </div>
                    <div className={styles.par}>
                        <span>Par</span>
                        <span>5</span>
                        <span>3</span>
                        <span>4</span>
                        <span>3</span>
                        <span>5</span>
                        <span>4</span>
                        <span>4</span>
                        <span>3</span>
                        <span>5</span>
                        <span>36</span>
                        <span>72</span>
                    </div>
                    <div className={styles.score}>
                        <span>Score</span>
                        <span>6</span>
                        <span>2</span>
                        <span>5</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                        <span>4</span>
                        <span>3</span>
                        <span>6</span>
                        <span className={styles.sub}>41</span>
                        <span className={styles.total}>77</span>
                    </div>
                </article>
            </div>
        </AuthCheck>
    ) : null;
};

export default Scorecard;
