import { useRouter } from 'next/router';
import styles from '../../styles/UserProfile.module.scss';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

function GoogleSignOutButton() {
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
}

export default GoogleSignOutButton;
