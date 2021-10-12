import { useContext } from 'react';
import { UserContext } from '../lib/context';

import SignInButton from '../components/SignInButton';
import SignOutButton from '../components/SignOutButton';
import UserNameForm from '../components/UserNameForm';

const Login = (props) => {
    const { user, username } = useContext(UserContext);

    return (
        <div>
            {user ? (
                !username ? (
                    <UserNameForm />
                ) : (
                    <SignOutButton />
                )
            ) : (
                <SignInButton />
            )}
        </div>
    );
};

export default Login;
