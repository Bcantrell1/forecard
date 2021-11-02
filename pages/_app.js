import '../styles/globals.scss';

import Navbar from '../components/Navbar';
import { useUserData } from '../lib/hooks';
import { UserContext } from '../lib/context';

import { Toaster } from 'react-hot-toast';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
    const userData = useUserData();

    return (
        <UserContext.Provider value={userData}>
            <Navbar />
            <Component {...pageProps} />
            <Footer />
            <Toaster />
        </UserContext.Provider>
    );
}

export default MyApp;
