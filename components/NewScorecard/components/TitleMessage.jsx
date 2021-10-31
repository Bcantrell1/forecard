const TitleMessage = ({ title, isValidTitle, loading }) => {
    if (loading) {
        return <p>Checking valid title...</p>;
    } else if (!isValidTitle) {
        return (
            <p className="text-success">
                The title should be between 3 and 30 characters,
                <br />
                and cannot be a duplicate of another scorecard.
            </p>
        );
    } else if (isValidTitle) {
        return <p className="text-success">{title} is available!</p>;
    } else {
        return <p></p>;
    }
};
export default TitleMessage;
