import Image from 'next/image';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import styles from '../styles/UserProfile.module.scss';
import { useRouter } from 'next/dist/client/router';
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
                    <SignOutButton />
                </div>
            </div>
        </div>
    );
};

const SignOutButton = () => {
    const router = useRouter();
    return (
        <button
            className={`${styles.profileCard__button} ${styles.buttonOrange}`}
            onClick={async () =>
                await signOut(auth).then(() => router.push('/'))
            }
        >
            Sign Out
        </button>
    );
};
