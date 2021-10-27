import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    firestore,
    getUserByUsername,
    getUserUid,
} from '../../../lib/firebase';
import { doc, deleteDoc, onSnapshot, query } from '@firebase/firestore';

import styles from '../../../styles/Scorecard.module.scss';
import { AnimatePresence } from 'framer-motion';

import AuthCheck from '../../../components/AuthCheck';
import ScoreModal from '../../../components/ScoreModal';

export async function getServerSideProps({ params }) {
    const { username, slug } = params;
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
            userUid,
            slug,
        },
    };
}

const Scorecard = ({ user, username, userUid, slug }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [cardData, setCardData] = useState([]);
    const [total, setTotal] = useState(0);
    const [frontTotal, setFrontTotal] = useState(0);
    const [backTotal, setBackTotal] = useState(0);
    const [holeId, setHoleId] = useState('');
    const close = () => setModalOpen(false);
    const open = () => setModalOpen(true);
    const router = useRouter();

    const deleteCard = async () => {
        const ref = doc(firestore, `users/${userUid}/scorecards/${slug}`);
        await deleteDoc(ref).then(router.push(`/${username}/scorecards`));
    };

    const updateHole = (e) => {
        modalOpen ? close() : open();
        setHoleId(e.target.getAttribute('value'));
    };

    useEffect(() => {
        const addTotal = (cardData) => {
            return Object.values(cardData.content.score).reduce(
                (acc, current) => parseInt(current) + parseInt(acc)
            );
        };

        const addFront = (cardData) => {
            const values = Object.entries(cardData.content.score);
            let total = 0;
            values.forEach((val) => {
                const hole = val[0].replace('hole', '');
                if (hole <= 9) {
                    total += parseInt(val[1]);
                }
            });
            return total;
        };

        const addBack = (cardData) => {
            const values = Object.entries(cardData.content.score);
            let total = 0;
            values.forEach((val) => {
                const hole = val[0].replace('hole', '');
                if (hole >= 10) {
                    total += parseInt(val[1]);
                }
            });
            return total;
        };

        const docRef = doc(firestore, `users/${userUid}/scorecards/${slug}`);
        const q = query(docRef);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setCardData(querySnapshot.data());
            setTotal(addTotal(querySnapshot.data()));
            setFrontTotal(addFront(querySnapshot.data()));
            setBackTotal(addBack(querySnapshot.data()));
        });
        return unsubscribe;
    }, []);

    return cardData.content ? (
        <AuthCheck user={user}>
            <h1>{slug}</h1>
            <div className={styles.cardContainer}>
                <article className={styles.front9}>
                    <div className={styles.hole}>
                        <span>Front</span>
                        {[...Array(9).keys()].map((hole) => {
                            return <span key={hole + 1}>{hole + 1}</span>;
                        })}
                        <span>Out</span>
                    </div>
                    <div className={styles.par}>
                        <span>Par</span>
                        {[...Array(9).keys()].map((hole) => {
                            return (
                                <span
                                    key={hole + 1}
                                    value={`hole${hole + 1}`}
                                    onClick={updateHole}
                                >
                                    {eval(
                                        `cardData.content.par.hole${hole + 1}`
                                    )}
                                </span>
                            );
                        })}
                        <span>{cardData.content.par.front}</span>
                    </div>
                    <div className={styles.score}>
                        <span>Score</span>
                        {[...Array(9).keys()].map((hole) => {
                            return (
                                <span
                                    key={hole + 1}
                                    value={`hole${hole + 1}`}
                                    onClick={updateHole}
                                >
                                    {eval(
                                        `cardData.content.score.hole${hole + 1}`
                                    )}
                                </span>
                            );
                        })}
                        <span>{frontTotal}</span>
                    </div>
                </article>
                <article className={styles.back9}>
                    <div className={styles.hole}>
                        <span>Back</span>
                        {[...Array(9).keys()].map((hole) => {
                            return <span key={hole + 10}>{hole + 10}</span>;
                        })}
                        <span>In</span>
                        <span>Total</span>
                    </div>
                    <div className={styles.par}>
                        <span>Par</span>
                        {[...Array(9).keys()].map((hole) => {
                            return (
                                <span
                                    key={hole + 10}
                                    value={`hole${hole + 10}`}
                                    onClick={updateHole}
                                >
                                    {eval(
                                        `cardData.content.par.hole${hole + 10}`
                                    )}
                                </span>
                            );
                        })}
                        <span>{cardData.content.par.back}</span>
                        <span>{cardData.content.par.total}</span>
                    </div>
                    <div className={styles.score}>
                        <span>Score</span>
                        {[...Array(9).keys()].map((hole) => {
                            return (
                                <span
                                    key={hole + 10}
                                    value={`hole${hole + 10}`}
                                    onClick={updateHole}
                                >
                                    {eval(
                                        `cardData.content.score.hole${
                                            hole + 10
                                        }`
                                    )}
                                </span>
                            );
                        })}
                        <span>{backTotal}</span>
                        <span>{total}</span>
                    </div>
                </article>
            </div>
            <button onClick={deleteCard}> Delete </button>
            <AnimatePresence
                initial={false}
                exitBeforeEnter={true}
                onExitComplete={() => null}
            >
                {modalOpen && (
                    <ScoreModal
                        modalOpen={modalOpen}
                        handleClose={close}
                        holeId={holeId}
                        slug={slug}
                    />
                )}
            </AnimatePresence>
        </AuthCheck>
    ) : null;
};

export default Scorecard;
