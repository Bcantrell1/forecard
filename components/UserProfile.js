import Image from 'next/image';

export const UserProfile = ({ user }) => {
    return (
        <div>
            <img
                src={user.photoURL || '/user_profile.png'}
                alt="profile picture"
            />
            <p>
                <i>{user.username}</i>
            </p>
            <h1>{user.displayName || 'Anonymous User'}</h1>
        </div>
    );
};
