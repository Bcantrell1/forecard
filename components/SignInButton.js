import { auth, googleAuthProvider } from '../lib/firebase';
import Image from 'next/image';

import { signInWithPopup } from 'firebase/auth';

const SignInButton = () => {
    const googleSignIn = async () => {
        await signInWithPopup(auth, googleAuthProvider);
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

export default SignInButton;
