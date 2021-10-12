import AuthCheck from '../../../components/AuthCheck';
const Scorecard = ({ user, scorecard }) => {
    return (
        <div>
            <AuthCheck user={user}>Scorecard Field</AuthCheck>
        </div>
    );
};

export default Scorecard;
