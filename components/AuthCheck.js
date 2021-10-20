import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

//Check to make sure user is Authenticated
const AuthCheck = ({ user, children }) => {
    let authenticated = false;
    const { username } = useContext(UserContext);
    if (username === user?.username) {
        console.log('User is Authenticated');
        authenticated = true;
    }

    return authenticated ? (
        children
    ) : (
        <Link href="/login">Login to view this page.</Link>
    );
};

export default AuthCheck;
