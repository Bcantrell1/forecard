import Image from 'next/image';

export const UserProfile = ({ user }) => {
    return (
        <div className="align-middle">
            <Image
                src={user.photoURL || '/user_profile.png    '}
                alt="profile picture"
                width="100"
                height="100"
            />
            <p>
                <i>{user.username || 'Anonymous User'}</i>
            </p>
            <h1>{user.displayName || 'Anonymous Display Name'}</h1>
        </div>
    );
};
