import styles from '../../../styles/Scorecard.module.scss';
import AuthCheck from '../../../components/AuthCheck';
import { useRouter } from 'next/dist/client/router';
import {
    firestore,
    getUserByUsername,
    getUserUid,
    serverTimeStamp,
} from '../../../lib/firebase';
import { doc, getDoc, deleteDoc, updateDoc } from '@firebase/firestore';

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
            userUid,
            slug,
            scorecard,
        },
    };
}

const Scorecard = ({ user, userUid, slug, scorecard }) => {
    const router = useRouter();
    const card = JSON.parse(scorecard);
    const par = card.content.par;
    const score = card.content.score;

    const deleteCard = async () => {
        const ref = doc(firestore, `users/${userUid}/scorecards/${slug}`);
        await deleteDoc(ref).then(router.push(`/${user}/scorecards`));
    };

    const updateHole = async (holeId, score) => {
        const holeRef = doc(firestore, `users/${userUid}/scorecards/${slug}`);
        await updateDoc(holeRef, {
            content: {
                score: {
                    [holeId]: score,
                },
            },
            updatedAt: serverTimeStamp,
        });
    };

    return scorecard ? (
        <AuthCheck user={user}>
            <h1>{slug}</h1>
            <button onClick={deleteCard}> Delete </button>
            <div className={styles.cardContainer}>
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
                        <span>{par.hole1}</span>
                        <span>{par.hole2}</span>
                        <span>{par.hole3}</span>
                        <span>{par.hole4}</span>
                        <span>{par.hole5}</span>
                        <span>{par.hole6}</span>
                        <span>{par.hole7}</span>
                        <span>{par.hole8}</span>
                        <span>{par.hole9}</span>
                        <span>{par.front}</span>
                    </div>
                    <div className={styles.score}>
                        <span>Score</span>
                        <span>{score.hole1}</span>
                        <span>{score.hole2}</span>
                        <span>{score.hole3}</span>
                        <span>{score.hole4}</span>
                        <span>{score.hole5}</span>
                        <span>{score.hole6}</span>
                        <span>{score.hole7}</span>
                        <span>{score.hole8}</span>
                        <span>{score.hole9}</span>
                        <span className={styles.sub}>0</span>
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
                        <span>{par.hole10}</span>
                        <span>{par.hole11}</span>
                        <span>{par.hole12}</span>
                        <span>{par.hole13}</span>
                        <span>{par.hole14}</span>
                        <span>{par.hole15}</span>
                        <span>{par.hole16}</span>
                        <span>{par.hole17}</span>
                        <span>{par.hole18}</span>
                        <span>{par.back}</span>
                        <span>{par.total}</span>
                    </div>
                    <div className={styles.score}>
                        <span>Score</span>
                        <span>{score.hole10}</span>
                        <span>{score.hole11}</span>
                        <span>{score.hole12}</span>
                        <span>{score.hole13}</span>
                        <span>{score.hole14}</span>
                        <span>{score.hole15}</span>
                        <span>{score.hole16}</span>
                        <span>{score.hole17}</span>
                        <span>{score.hole18}</span>
                        <span className={styles.sub}>0</span>
                        <span className={styles.total}>0</span>
                    </div>
                </article>
            </div>
        </AuthCheck>
    ) : null;
};

export default Scorecard;
