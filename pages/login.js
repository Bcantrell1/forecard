import { useContext } from 'react';
import { UserContext } from '../lib/context';

import { auth, googleAuthProvider } from '../lib/firebase';
import Image from 'next/image';

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

const SignInButton = () => {
    const googleSignIn = async () => {
        await auth.signInWithPopup(googleAuthProvider);
    };

    return (
        <Image
            src="/btn_google_signin_dark_normal_web.png"
            width="191"
            height="46"
            alt="google-sign-in-button"
            onClick={googleSignIn}
        />
    );
};

const SignOutButton = () => {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
};

export default Login;
