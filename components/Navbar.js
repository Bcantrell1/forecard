import { useContext } from 'react';
import { UserContext } from '../lib/context';

import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    const { user, username } = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/" passHref>
                        <Image
                            className="logo"
                            src="/forecard.png"
                            height="120"
                            width="160"
                            alt="logo"
                        />
                    </Link>
                </li>

                {/* Signed-in */}
                {username && (
                    <>
                        <li>
                            <Link href={`/${username}/scorecards`} passHref>
                                <button className="btn-green">
                                    My Scorecards
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`} passHref>
                                <Image
                                    className="profile-image"
                                    src={user?.photoURL}
                                    width="50"
                                    height="50"
                                    alt="profile image"
                                />
                            </Link>
                        </li>
                    </>
                )}

                {/* Signed-out */}
                {!username && (
                    <li>
                        <Link href="/login" passHref>
                            <button className="btn-login">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
