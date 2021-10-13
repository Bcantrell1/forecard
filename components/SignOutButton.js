import { useRouter } from 'next/router';
import { auth } from '../lib/firebase';

const SignOutButton = () => {
    const router = useRouter();
    return (
        <button onClick={() => auth.signOut().then(() => router.push('/'))}>
            Sign Out
        </button>
    );
};

export default SignOutButton;
