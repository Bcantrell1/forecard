import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../lib/context';
import styles from '../../styles/Navbar.module.scss';

import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '../Utilities/ThemeToggle';

const Navbar = () => {
    const { user, username } = useContext(UserContext);
    const [currentTheme, setCurrentTheme] = useState('');
    return (
        <nav className={styles.navbar}>
            <ul>
                <li className={styles.logo}>
                    <Link href="/">
                        <a>
                            <Image
                                src={
                                    currentTheme == 'light'
                                        ? '/logo-dark.png'
                                        : '/logo-light.png'
                                }
                                width={194}
                                height={70}
                                layout="responsive"
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
                                <a className={styles.scorecardButton}>
                                    My Scorecards
                                </a>
                            </Link>
                        </li>
                        <li>
                            <ThemeToggle theme={setCurrentTheme} />
                        </li>
                        <li>
                            <Link href={`/${username}`}>
                                <a>
                                    <Image
                                        src={
                                            user?.photoURL ||
                                            '/user_profile.png'
                                        }
                                        layout="fixed"
                                        width={60}
                                        height={60}
                                        className={styles.profileImage}
                                        alt="profile image"
                                    />
                                </a>
                            </Link>
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
