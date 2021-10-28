import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../lib/context';

//Check to make sure user is Authenticated
const AdminCheck = ({ user, children }) => {
    let authenticated = false;
    const { username } = useContext(UserContext);
    if (username === 'ziggy') {
        console.log('User is an Admin');
        authenticated = true;
    }

    return authenticated ? (
        children
    ) : (
        <Link href="/">You must be an admin to view this page.</Link>
    );
};

export default AdminCheck;
