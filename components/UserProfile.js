import Image from 'next/image';
import SignOutButton from '../components/SignOutButton';

export const UserProfile = ({ user }) => {
    return (
        <div className="align-middle">
            <Image
                src={user.photoURL || '/user_profile.png'}
                width="100"
                height="100"
                alt="profile picture"
            />
            <p>
                <i>{user.username || 'Anonymous User'}</i>
            </p>
            <h1>{user.displayName || 'Anonymous Display Name'}</h1>
            <SignOutButton />
        </div>
    );
};
