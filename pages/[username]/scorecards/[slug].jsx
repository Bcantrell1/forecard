import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import {
    firestore,
    getUserByUsername,
    getUserUid,
} from '../../../lib/firebase';
import { doc, deleteDoc, onSnapshot, query } from '@firebase/firestore';

import { addTotal, addFront, addBack } from '../../../utility/helper';

import styles from '../../../styles/Scorecard.module.scss';
import { AnimatePresence } from 'framer-motion';

import AuthCheck from '../../../components/Utilities/AuthCheck';
import UpdateModal from '../../../components/Scorecard/UpdateModal';

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
    const [cardData, setCardData] = useState(null);
    const [total, setTotal] = useState(0);
    const [frontTotal, setFrontTotal] = useState(0);
    const [backTotal, setBackTotal] = useState(0);
    const [holeId, setHoleId] = useState('');
    const close = () => setModalOpen(false);
    const open = () => setModalOpen(true);
    const router = useRouter();

    const deleteCard = async () => {
        const ref = doc(firestore, `users/${userUid}/scorecards/${slug}`);
        await deleteDoc(ref).then(() => router.push(`/${username}/scorecards`));
    };

    const updateHole = (e) => {
        modalOpen ? close() : open();
        setHoleId(e.target.getAttribute('value'));
    };

    const liveScorecard = async (userUid, slug) => {
        const docRef = doc(firestore, `users/${userUid}/scorecards/${slug}`);
        const q = query(docRef);
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const data = await querySnapshot.data();
            if (data) {
                setCardData(data);
                setTotal(addTotal(data));
                setFrontTotal(addFront(data));
                setBackTotal(addBack(data));
            }
        });

        return unsubscribe;
    };

    useEffect(() => {
        liveScorecard(userUid, slug);
    }, [userUid, slug]);

    return cardData ? (
        <AuthCheck user={user}>
            <div className={styles.title}>
                <h1>{cardData.title}</h1>
            </div>
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
                    </div>
                </article>
            </div>
            <div className={styles.cardData}>
                <span>Course Par: {cardData.content.par.total}</span>
                <span>Your score: {total}</span>
            </div>
            <button
                className={styles.deleteButton}
                onClick={deleteCard}
            ></button>

            <AnimatePresence
                initial={false}
                exitBeforeEnter={true}
                onExitComplete={() => null}
            >
                {modalOpen && (
                    <UpdateModal
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
