import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';
import { serverTimeStamp, firestoreDb, auth } from '../lib/firebase';

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
        const ref = firestoreDb
            .collection('users')
            .doc(uid)
            .collection('scorecards')
            .doc(slug);

        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: {
                score: {},
                par: {},
            },
            createdAt: serverTimeStamp(),
            updatedAt: serverTimeStamp(),
        };
        await ref.set(data);

        toast.success('Scorecard Saved');

        router.push(`/${username}/scorecards/${slug}`);
    };

    useEffect(() => {
        checkTitle(title);
        console.log(isValid, isValidTitle);
    }, [title]);

    const checkTitle = useCallback(
        debounce(async (title) => {
            if (title.length >= 3) {
                const ref = firestoreDb.doc(
                    `users/${auth.currentUser.uid}/scorecards/${title}`
                );
                const { exists } = await ref.get();
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
