import ScorecardFeed from './ScorecardFeed';

const ScorecardList = ({ scorecardList }) => {
    return (
        <>
            {scorecardList && (
                <div style={{ textAlign: 'center' }}>
                    <h1>Your Scorecards</h1>
                    <span>
                        <ScorecardFeed scorecards={scorecardList} />
                    </span>
                </div>
            )}
        </>
    );
};

export default ScorecardList;
