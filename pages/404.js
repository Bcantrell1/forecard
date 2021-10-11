import Link from 'next/link';
import Image from 'next/image';

const Custom404 = () => {
    return (
        <main>
            <h1>FORE!! Welp, at least you didnt hit a window...</h1>
            <Image src="/404_Image.jpg" width="400" height="600"></Image>
            <Link href="/">
                <button className="norm-btn">Go home</button>
            </Link>
        </main>
    );
};

export default Custom404;
