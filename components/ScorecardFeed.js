const ScorecardFeed = ({ scorecards }) => {
    return scorecards ? (
        <>
            {scorecards.map((card) => (
                <Scorecard scorecard={card} key={card.slug} />
            ))}
        </>
    ) : null;
};

export default ScorecardFeed;

const Scorecard = ({ scorecard }) => {
    console.log(scorecard);
    return (
        <div className="scorecard">
            <div>This is the scorecard</div>
        </div>
    );
};
