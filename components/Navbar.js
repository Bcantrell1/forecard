import { useContext } from 'react';
import { UserContext } from '../lib/context';
import styles from '../styles/Navbar.module.scss';

import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, username } = useContext(UserContext);

    return (
        <nav className={styles.navbar}>
            <ul>
                <li>
                    <Link href="/">
                        <a>
                            <Image
                                className={styles.logo}
                                src="/forecard.png"
                                height="120"
                                width="160"
                                alt="logo"
                            />
                        </a>
                    </Link>
                </li>

                {/* Signed-in */}
                {username && (
                    <>
                        <li>
                            <Link href={`/${username}/scorecards`}>
                                <a className="btn-green">My Scorecards</a>
                            </Link>
                        </li>
                        <li>
                            <div
                                style={{
                                    display: 'flex',
                                }}
                            >
                                <ThemeToggle />
                                <Link href={`/${username}`}>
                                    <a>
                                        <Image
                                            className={styles.profileImage}
                                            src={
                                                user?.photoURL ||
                                                '/user_profile.png'
                                            }
                                            width="60"
                                            height="60"
                                            alt="profile image"
                                        />
                                    </a>
                                </Link>
                            </div>
                        </li>
                    </>
                )}

                {/* Signed-out */}
                {!username && (
                    <li>
                        <Link href="/login">
                            <a className={styles.btnLogin}>Log in</a>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
