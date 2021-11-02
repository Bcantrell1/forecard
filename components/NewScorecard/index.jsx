import { useState, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../../lib/context';

import { serverTimeStamp, firestore, auth } from '../../lib/firebase';
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';

import TitleMessage from './components/TitleMessage';

import styles from '../../styles/NewScorecard.module.scss';

import { kebabCase, debounce } from 'lodash';
import toast from 'react-hot-toast';

const NewScorecard = () => {
    const router = useRouter();
    const { username } = useContext(UserContext);

    //Scorecard
    const [title, setTitle] = useState('');
    const slug = encodeURI(kebabCase(title));

    //Course Selection
    const [states, setStates] = useState(null);
    const [provence, setProvence] = useState(null);
    const [cities, setCities] = useState(null);
    const [courses, setCourses] = useState(null);
    const [currentProvence, setCurrentProvence] = useState('');
    const [currentCity, setCurrentCity] = useState(null);
    const [currentCourse, setCurrentCourse] = useState(null);
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

    const queryCollection = async (path, setState) => {
        let array = [];
        const ref = collection(firestore, path);
        let refSnapshot = await getDocs(ref);
        refSnapshot.forEach((collection) => {
            array.push(collection.id);
        });
        setState(array);
    };

    const checkTitle = useCallback(
        debounce(async (title) => {
            if (title.length >= 3 && title.length < 30) {
                const ref = doc(
                    firestore,
                    `users/${
                        auth.currentUser.uid
                    }/scorecards/${title.toLowerCase()}`
                );
                const checkTitle = await getDoc(ref);
                const exists = checkTitle.exists();
                console.log('Firestore read executed! ');
                setIsValidTitle(!exists);
                setLoading(false);
            } else {
                setIsValidTitle(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        checkTitle(title);
        queryCollection(`courses`, setStates);
    }, [title]);

    return (
        <div className={styles.container}>
            <form onSubmit={createScorecard}>
                <h2>New Scorecard</h2>
                <input
                    className={styles.nameInput}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Scorecard Name"
                    required
                />
                <TitleMessage
                    title={title}
                    isValidTitle={isValidTitle}
                    loading={loading}
                />
                <p>Scorecard Name: {slug}</p>
                <div className={styles.courseContainer}>
                    {states ? (
                        <select
                            onClick={(e) => {
                                setProvence(e.target.value);
                                queryCollection(
                                    `courses/${states}/city`,
                                    setCities
                                );
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
                            onClick={(e) => {
                                setCurrentCity(e.target.value);
                                queryCollection(
                                    `courses/${provence}/city/${e.target.value}/course`,
                                    setCourses
                                );
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
                            onClick={(e) => {
                                setCurrentCourse(e.target.value);
                                getCourse(
                                    currentProvence,
                                    currentCity,
                                    e.target.value
                                );
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
                </div>
                <button
                    type="submit"
                    disabled={
                        !isValidTitle || !currentCourse ? 'disabled' : null
                    }
                    className={
                        !isValidTitle || !currentCourse
                            ? 'btn-red'
                            : 'btn-green'
                    }
                >
                    Create Scorecard
                </button>
            </form>
        </div>
    );
};

export default NewScorecard;
