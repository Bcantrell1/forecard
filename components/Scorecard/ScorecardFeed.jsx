import Image from 'next/image';
import styles from '../../styles/ScorecardFeed.module.scss';
import { useRouter } from 'next/router';
import React from 'react';

const ScorecardFeed = ({ scorecards }) => {
    return scorecards ? (
        <div className={styles.cardWrapper}>
            {scorecards.map((scorecard) => (
                <ScorecardItem
                    card={scorecard}
                    key={JSON.parse(scorecard).slug}
                />
            ))}
        </div>
    ) : null;
};

const ScorecardItem = ({ card }) => {
    const router = useRouter();
    const cardData = JSON.parse(card);
    return (
        <div
            className={styles.cardItem}
            onClick={() =>
                router.push(`/${cardData.username}/scorecards/${cardData.slug}`)
            }
        >
            <div className={styles.cardHeader}>
                <div className={styles.cardUser}>{cardData.title}</div>
            </div>
            <Image
                className={styles.cardImage}
                src="/card_item.png"
                height={250}
                width={250}
                layout="responsive"
            />
        </div>
    );
};

export default ScorecardFeed;
