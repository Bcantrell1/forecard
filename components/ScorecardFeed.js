import { useRouter } from 'next/router';
import React from 'react';

const ScorecardFeed = ({ scorecards }) => {
    return scorecards
        ? scorecards.map((scorecard) => (
              <ul key={scorecard.slug}>
                  <ScorecardItem card={scorecard} key={scorecard.slug} />
              </ul>
          ))
        : null;
};

const ScorecardItem = ({ card }) => {
    const router = useRouter();
    return (
        <li
            className="scorecard-item"
            onClick={() =>
                router.push(`/${card.username}/scorecards/${card.slug}`)
            }
        >
            <p>{card.slug}</p>
        </li>
    );
};

export default ScorecardFeed;
