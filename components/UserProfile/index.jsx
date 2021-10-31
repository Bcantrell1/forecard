import Image from 'next/image';
import GoogleSignOutButton from '../Global/GoogleSignOutButton';
import styles from '../../styles/UserProfile.module.scss';
export const UserProfile = ({ user }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.profileCard}>
                <div className={styles.profileCard__img}>
                    <Image
                        src={user.photoURL || '/user_profile.png'}
                        width="150"
                        height="150"
                        alt="profile picture"
                    />
                </div>
                <div className={styles.profileCard__cnt}>
                    <div className={styles.profileCard__name}>
                        <i>{user.username || 'Anonymous User'}</i>
                    </div>
                    <h1>{user.displayName || 'Anonymous Display Name'}</h1>
                    <GoogleSignOutButton />
                </div>
            </div>
        </div>
    );
};
