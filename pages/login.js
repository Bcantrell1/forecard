import { useContext } from 'react';
import { UserContext } from '../lib/context';

import SignInButton from '../components/Utilities/SignInButton';
import UserNameForm from '../components/UserNameForm';
import { useRouter } from 'next/dist/client/router';

const Login = (props) => {
    const router = useRouter();
    const { user, username } = useContext(UserContext);

    return (
        <div>
            {user ? (
                !username ? (
                    <UserNameForm />
                ) : (
                    <button onClick={() => router.push(`/${username}`)}>
                        User Profile
                    </button>
                )
            ) : (
                <SignInButton />
            )}
        </div>
    );
};

export default Login;
