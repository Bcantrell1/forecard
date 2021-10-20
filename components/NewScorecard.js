import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';
import { serverTimeStamp, firestore, auth } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { kebabCase, debounce } from 'lodash';
import toast from 'react-hot-toast';

const NewScorecard = () => {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [isValidTitle, setIsValidTitle] = useState(false);
    const [loading, setLoading] = useState(false);

    const slug = encodeURI(kebabCase(title));

    const isValid = title.length > 3 && title.length < 100;

    const createScorecard = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(firestore, 'users', uid, 'scorecards', slug);

        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: {},
            createdAt: serverTimeStamp,
            updatedAt: serverTimeStamp,
        };
        await setDoc(ref, data);

        toast.success('Scorecard Saved');

        setTimeout(() => {
            router.push(`/${username}/scorecards/${slug}`);
        }, 1500);
    };

    useEffect(() => {
        checkTitle(title);
    }, [title]);

    const checkTitle = useCallback(
        debounce(async (title) => {
            if (title.length >= 3) {
                const ref = doc(
                    firestore,
                    `users/${auth.currentUser.uid}/scorecards/${title}`
                );
                const checkTitle = await getDoc(ref);
                const exists = checkTitle.exists();
                console.log('Firestore read executed!');
                setIsValidTitle(!exists);
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        <form onSubmit={createScorecard}>
            <p>New Scorecard</p>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Scorecard Name"
            />
            <TitleMessage
                title={title}
                isValidTitle={isValidTitle}
                loading={loading}
            />
            <p>Scorecard Name: {slug}</p>
            <button
                type="submit"
                disabled={!isValidTitle ? 'disabled' : null}
                className={!isValidTitle ? 'btn-red' : 'btn-green'}
            >
                Create Scorecard
            </button>
        </form>
    );
};

const TitleMessage = ({ title, isValidTitle, loading }) => {
    if (loading) {
        return <p>Checking valid title...</p>;
    } else if (isValidTitle) {
        return <p className="text-success">{title} is available!</p>;
    } else if (title && !isValidTitle) {
        return (
            <p className="text-danger">
                You already used <strong>{title}</strong> as a title!
            </p>
        );
    } else {
        return <p></p>;
    }
};

export default NewScorecard;
