import { auth } from '../lib/firebase';

const SignOutButton = () => {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
};

export default SignOutButton;
