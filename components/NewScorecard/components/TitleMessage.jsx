const TitleMessage = ({ title, isValidTitle, loading, isValid }) => {
    if (loading) {
        return <p>Checking valid title...</p>;
    } else if (isValidTitle && isValid) {
        return <p className="text-success">{title} is available!</p>;
    } else if (!isValid && isValidTitle) {
        return (
            <p className="text-success">
                The title should be between 3 and 100 characters,
                <br />
                and cannot be a duplicate of another scorecard.
            </p>
        );
    } else if (title && !isValidTitle) {
        return (
            <p className="text-danger">
                You already used <strong>{title}</strong> as a title!
            </p>
        );
    } else {
        return <p></p>;
    }
};
export default TitleMessage;
