import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';
import { serverTimeStamp, firestore, auth } from '../lib/firebase';
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';

import { kebabCase, debounce, pick } from 'lodash';
import toast from 'react-hot-toast';

const NewScorecard = () => {
    const router = useRouter();
    const { username } = useContext(UserContext);

    //Scorecard
    const [title, setTitle] = useState('');
    const slug = encodeURI(kebabCase(title));
    const isValid = title.length > 3 && title.length < 100;

    //Course Selection
    const [states, setStates] = useState(null);
    const [provence, setProvence] = useState(null);
    const [cities, setCities] = useState(null);
    const [courses, setCourses] = useState(null);
    const [currentProvence, setCurrentProvence] = useState('');
    const [currentCity, setCurrentCity] = useState('');
    const [currentCourse, setCurrentCourse] = useState('');
    const [pickedCourse, setPickedCourse] = useState({});

    //Validation
    const [isValidTitle, setIsValidTitle] = useState(false);
    const [loading, setLoading] = useState(false);

    const createScorecard = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(firestore, 'users', uid, 'scorecards', slug);

        const courseName = pickedCourse.name;
        const hole = pickedCourse;

        const data = {
            title,
            slug,
            uid,
            username,
            published: false,
            content: {
                par: {
                    hole1: hole[1].par,
                    hole2: hole[2].par,
                    hole3: hole[3].par,
                    hole4: hole[4].par,
                    hole5: hole[5].par,
                    hole6: hole[6].par,
                    hole7: hole[7].par,
                    hole8: hole[8].par,
                    hole9: hole[9].par,
                    hole10: hole[10].par,
                    hole11: hole[11].par,
                    hole12: hole[12].par,
                    hole13: hole[13].par,
                    hole14: hole[14].par,
                    hole15: hole[15].par,
                    hole16: hole[16].par,
                    hole17: hole[17].par,
                    hole18: hole[18].par,
                    front: hole.front,
                    back: hole.back,
                    total: hole.total,
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
            course: courseName,
            createdAt: serverTimeStamp,
            updatedAt: serverTimeStamp,
        };
        await setDoc(ref, data);

        toast.success('Scorecard Saved');

        setTimeout(() => {
            router.push(`/${username}/scorecards/${slug}`);
        }, 1000);
    };

    const getCourse = async (state, city, course) => {
        const courseRef = doc(
            firestore,
            `courses/${state}/city/${city}/course/${course}`
        );
        const courseSnapshot = await getDoc(courseRef);

        const data = courseSnapshot.data();

        setPickedCourse(data);
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
            const ref = collection(firestore, `courses/${state}/city`);
            let citySnapshot = await getDocs(ref);
            citySnapshot.forEach((city) => {
                console.log(city.id);
                cities.push(city.id);
            });
            setCities(cities);
        }
    };

    const getCourses = async (state, city) => {
        let courses = [];
        if (state && city) {
            const ref = collection(
                firestore,
                `courses/${state}/city/${city}/course`
            );
            let courseList = await getDocs(ref);
            courseList.forEach((course) => {
                console.log(course.id);
                courses.push(course.id);
            });
        }
        setCourses(courses);
    };

    useEffect(() => {
        checkTitle(title);
        getStates();
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
                <select
                    value={currentProvence}
                    onClick={(e) => {
                        setProvence(e.target.value);
                        getCities(e.target.value);
                        setCurrentProvence(e.target.value);
                    }}
                >
                    {states.map((state) => {
                        return (
                            <option value={state} key={state}>
                                {state}
                            </option>
                        );
                    })}
                </select>
            ) : null}
            {cities ? (
                <select
                    value={currentCity}
                    onClick={(e) => {
                        setCurrentCity(e.target.value);
                        getCourses(provence, e.target.value);
                    }}
                >
                    {cities.map((city) => {
                        return (
                            <option value={city} key={city}>
                                {city}
                            </option>
                        );
                    })}
                </select>
            ) : null}
            {courses ? (
                <select
                    value={currentCourse}
                    onClick={(e) => {
                        setCurrentCourse(e.target.value);
                        getCourse(currentProvence, currentCity, e.target.value);
                    }}
                >
                    {courses.map((course) => {
                        return (
                            <option value={course} key={course}>
                                {course}
                            </option>
                        );
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
