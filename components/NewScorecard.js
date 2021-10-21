import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';
import { serverTimeStamp, firestore, auth } from '../lib/firebase';
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';

import { kebabCase, debounce } from 'lodash';
import toast from 'react-hot-toast';

const NewScorecard = () => {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [state, setState] = useState(null);
    const [city, setCity] = useState(null);
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
            content: {
                par: {
                    hole1: 0,
                    hole2: 0,
                    hole3: 0,
                    hole4: 0,
                    hole5: 0,
                    hole6: 0,
                    hole7: 0,
                    hole8: 0,
                    hole9: 0,
                    hole10: 0,
                    hole11: 0,
                    hole12: 0,
                    hole13: 0,
                    hole14: 0,
                    hole15: 0,
                    hole16: 0,
                    hole17: 0,
                    hole18: 0,
                },
                score: {
                    hole1: 0,
                    hole2: 0,
                    hole3: 0,
                    hole4: 0,
                    hole5: 0,
                    hole6: 0,
                    hole7: 0,
                    hole8: 0,
                    hole9: 0,
                    hole10: 0,
                    hole11: 0,
                    hole12: 0,
                    hole13: 0,
                    hole14: 0,
                    hole15: 0,
                    hole16: 0,
                    hole17: 0,
                    hole18: 0,
                },
                yards: {
                    back: {
                        hole1: 0,
                        hole2: 0,
                        hole3: 0,
                        hole4: 0,
                        hole5: 0,
                        hole6: 0,
                        hole7: 0,
                        hole8: 0,
                        hole9: 0,
                        hole10: 0,
                        hole11: 0,
                        hole12: 0,
                        hole13: 0,
                        hole14: 0,
                        hole15: 0,
                        hole16: 0,
                        hole17: 0,
                        hole18: 0,
                    },
                    middle: {
                        hole1: 0,
                        hole2: 0,
                        hole3: 0,
                        hole4: 0,
                        hole5: 0,
                        hole6: 0,
                        hole7: 0,
                        hole8: 0,
                        hole9: 0,
                        hole10: 0,
                        hole11: 0,
                        hole12: 0,
                        hole13: 0,
                        hole14: 0,
                        hole15: 0,
                        hole16: 0,
                        hole17: 0,
                        hole18: 0,
                    },
                    forward: {
                        hole1: 0,
                        hole2: 0,
                        hole3: 0,
                        hole4: 0,
                        hole5: 0,
                        hole6: 0,
                        hole7: 0,
                        hole8: 0,
                        hole9: 0,
                        hole10: 0,
                        hole11: 0,
                        hole12: 0,
                        hole13: 0,
                        hole14: 0,
                        hole15: 0,
                        hole16: 0,
                        hole17: 0,
                        hole18: 0,
                    },
                },
            },
            course: null,
            createdAt: serverTimeStamp,
            updatedAt: serverTimeStamp,
        };
        await setDoc(ref, data);

        toast.success('Scorecard Saved');

        setTimeout(() => {
            router.push(`/${username}/scorecards/${slug}`);
        }, 1500);
    };

    const getCourses = async (state, city) => {
        if (state && city) {
            const ref = collection(firestore, `courses/${state}/${city}`);
            const courseList = await getDocs(ref);
            courseList.forEach((course) => {
                console.log(course.data());
            });
        }
    };

    useEffect(() => {
        checkTitle(title);
        getCourses(state, city);
    }, [title, state, city]);

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
                required
            />
            <TitleMessage
                title={title}
                isValidTitle={isValidTitle}
                loading={loading}
                isValid={isValid}
            />
            <p>Scorecard Name: {slug}</p>
            {/* <CourseSelect courses={courses} /> */}
            <button
                type="submit"
                disabled={!isValidTitle || !isValid ? 'disabled' : null}
                className={!isValidTitle || !isValid ? 'btn-red' : 'btn-green'}
            >
                Create Scorecard
            </button>
        </form>
    );
};

const TitleMessage = ({ title, isValidTitle, loading, isValid }) => {
    if (loading) {
        return <p>Checking valid title...</p>;
    } else if (isValidTitle && isValid) {
        return <p className="text-success">{title} is available!</p>;
    } else if (!isValid && isValidTitle) {
        return (
            <p className="text-success">
                The title should be between 3 and 100 characters,
                <br />
                and cannot be a duplicate of another scorecard.
            </p>
        );
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
