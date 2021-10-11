import { useContext } from 'react';
import { UserContext } from '../lib/context';

import styles from '../styles/Navbar.module.css';
import Link from 'next/link';

const Navbar = () => {
    const { user, username } = useContext(UserContext);

    return (
        <nav className={styles.navbar}>
            <ul>
                <li>
                    <Link href="/">
                        <button>Forecard</button>
                    </Link>
                </li>

                {/* Signed-in */}
                {username && (
                    <>
                        <li className={styles.pushLeft}>
                            <Link href="/cards">
                                <button className={styles.btnGreen}>
                                    My Scorecards
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <img src={user?.photoURL} />
                            </Link>
                        </li>
                    </>
                )}

                {/* Signed-out */}
                {!username && (
                    <li>
                        <Link href="/login">
                            <button className={styles.btnLogin}>Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
