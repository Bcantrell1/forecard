import styles from '../styles/ScorecardFeed.module.scss';
import { useRouter } from 'next/router';
import React from 'react';

const ScorecardFeed = ({ scorecards }) => {
    return scorecards ? (
        <div className={styles.cardWrapper}>
            {scorecards.map((scorecard) => (
                <ScorecardItem card={scorecard} key={scorecard.slug} />
            ))}
        </div>
    ) : null;
};

const ScorecardItem = ({ card }) => {
    const router = useRouter();
    return (
        <div
            className={styles.cardItem}
            onClick={() =>
                router.push(`/${card.username}/scorecards/${card.slug}`)
            }
        >
            <div className={styles.cardHeader}>
                <div className={styles.cardUser}>{card.title}</div>
            </div>
        </div>
    );
};

export default ScorecardFeed;
