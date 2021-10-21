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
    const [states, setStates] = useState(null);
    const [cities, setCities] = useState(null);
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

    const getStates = async () => {
        let states = [];
        const ref = collection(firestore, `courses`);
        let stateSnapshot = await getDocs(ref);
        stateSnapshot.forEach((state) => {
            states.push(state.id);
        });
        setStates(states);
    };

    const getCities = async (state) => {
        let cities = [];
        if (state) {
            const ref = doc(firestore, 'courses', state);
            let citySnapshot = await getDoc(ref);
            // citySnapshot.forEach((city) => {
            //     console.log(city.id);
            //     cities.push(city.id);
            // });
            console.log(citySnapshot.id);
            // setCities(cities);
        }
    };

    const getCourses = async (state, city) => {
        let courses = [];
        if (state && city) {
            const ref = collection(firestore, `courses/${state}/${city}`);
            let courseList = await getDocs(ref);
            courseList.forEach((course) => {
                courses.push(course.id);
            });
        }
        return courses;
    };

    useEffect(() => {
        checkTitle(title);
        getStates();
        if (states) {
            getCities(states);
        }
        // if (states && cities) {
        //     return getCourses(states, cities);
        // }
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
                required
            />
            <TitleMessage
                title={title}
                isValidTitle={isValidTitle}
                loading={loading}
                isValid={isValid}
            />
            <p>Scorecard Name: {slug}</p>
            {states ? (
                <select onClick={(e) => getCities(e.target.value)}>
                    {states.map((state) => {
                        return <option key={state}>{state}</option>;
                    })}
                </select>
            ) : null}
            {cities ? (
                <select>
                    {cities.map((city) => {
                        return <option key={city}>{city}</option>;
                    })}
                </select>
            ) : null}
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
