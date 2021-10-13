import { useRouter } from 'next/router';
import React from 'react';

const ScorecardFeed = ({ scorecards }) => {
    return scorecards
        ? scorecards.map((scorecard) => (
              <ul key={scorecard.slug}>
                  <Scorecard card={scorecard} key={scorecard.slug} />
              </ul>
          ))
        : null;
};

//Make click event for going to scorecard

const Scorecard = ({ card }) => {
    return (
        <li>
            <p>{card.slug}</p>
        </li>
    );
};

export default ScorecardFeed;
