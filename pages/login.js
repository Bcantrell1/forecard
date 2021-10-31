import { useContext } from 'react';
import { UserContext } from '../lib/context';

import GoogleSignInButton from '../components/Global/GoogleSignInButton';
import UserNameForm from '../components/UserNameForm';
import { useRouter } from 'next/dist/client/router';

const Login = () => {
    const router = useRouter();
    const { user, username } = useContext(UserContext);

    return (
        <div>
            {user ? (
                !username ? (
                    <UserNameForm />
                ) : (
                    <div>
                        <h1>You are logged in!</h1>
                        <h3>
                            Your username is: <strong>{username}</strong>
                        </h3>
                        <button onClick={() => router.push(`/${username}`)}>
                            My Profile
                        </button>
                    </div>
                )
            ) : (
                <GoogleSignInButton />
            )}
        </div>
    );
};

export default Login;
