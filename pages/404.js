import Link from 'next/link';
import Image from 'next/image';

const Custom404 = () => {
    return (
        <main className="align-middle white">
            <h1>FORE!!</h1>
            <h3>Page was not found</h3>
            <Image
                src="/404_Image.jpg"
                className="back-drop"
                layout="fill"
                alt="background-image"
            ></Image>
            <Link href="/">
                <button className="norm-btn">Go home</button>
            </Link>
        </main>
    );
};

export default Custom404;
