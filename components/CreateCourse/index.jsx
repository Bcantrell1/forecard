import { setDoc, doc } from '@firebase/firestore';
import { useState } from 'react';
import toast from 'react-hot-toast';
import SelectLocation from './components/SelectLocation';
import { firestore } from '../../lib/firebase';
import styles from '../../styles/Scorecard.module.scss';

const CreateCourse = () => {
    const [courseName, setCourseName] = useState('');
    const [courseState, setCourseState] = useState('');
    const [courseCity, setCourseCity] = useState('');
    const [courseData, setCourseData] = useState({
        1: {
            par: '',
        },
        2: {
            par: '',
        },
        3: {
            par: '',
        },
        4: {
            par: '',
        },
        5: {
            par: '',
        },
        6: {
            par: '',
        },
        7: {
            par: '',
        },
        8: {
            par: '',
        },
        9: {
            par: '',
        },
        10: {
            par: '',
        },
        11: {
            par: '',
        },
        12: {
            par: '',
        },
        13: {
            par: '',
        },
        14: {
            par: '',
        },
        15: {
            par: '',
        },
        16: {
            par: '',
        },
        17: {
            par: '',
        },
        18: {
            par: '',
        },
        name: courseName,
        back: '',
        front: '',
        total: '',
    });

    const createNewCourse = async (e) => {
        e.preventDefault();
        const ref = doc(
            firestore,
            `courses/${courseState}/city/${courseCity}/course/${courseName}`
        );
        await setDoc(ref, courseData);
        toast.success('Course Created');
    };

    const updatePar = (hole, score) => {
        setCourseData({ ...courseData, [hole]: { par: score } });
        console.log(courseData);
    };

    return (
        <form onSubmit={createNewCourse}>
            <p> {`New course name: ${courseName}`}</p>
            <input
                placeholder="Course Name"
                onChange={(e) => setCourseName(e.target.value)}
            />
            <SelectLocation
                onStateChange={setCourseState}
                onCityChange={setCourseCity}
            />
            <div className={styles.cardContainer}>
                <article className={styles.front9}>
                    <div className={styles.hole}>
                        <span>Front</span>
                        {[...Array(9).keys()].map((hole) => {
                            return <span key={hole + 1}>{hole + 1}</span>;
                        })}
                        <span>Out</span>
                    </div>

                    <div className={styles.par}>
                        <span>Par</span>

                        {[...Array(9).keys()].map((hole) => {
                            const holeNumber = hole + 1;
                            return (
                                <span key={holeNumber}>
                                    <select
                                        onClick={(e) =>
                                            updatePar(
                                                holeNumber,
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        {[...Array(3).keys()].map((score) => (
                                            <option key={score + 3}>
                                                {score + 3}
                                            </option>
                                        ))}
                                    </select>
                                </span>
                            );
                        })}

                        <span>0</span>
                    </div>
                </article>

                <article className={styles.back9}>
                    <div className={styles.hole}>
                        <span>Back</span>
                        {[...Array(9).keys()].map((hole) => {
                            return <span key={hole + 10}>{hole + 10}</span>;
                        })}
                        <span>In</span>
                        <span>Total</span>
                    </div>
                    <div className={styles.par}>
                        <span>Par</span>

                        {[...Array(9).keys()].map((hole) => {
                            const holeNumber = hole + 10;
                            return (
                                <span key={holeNumber}>
                                    <select
                                        onClick={(e) =>
                                            updatePar(
                                                holeNumber,
                                                e.target.value
                                            )
                                        }
                                        required
                                    >
                                        {[...Array(3).keys()].map((score) => (
                                            <option key={score + 3}>
                                                {score + 3}
                                            </option>
                                        ))}
                                    </select>
                                </span>
                            );
                        })}

                        <span>0</span>
                        <span>0</span>
                    </div>
                </article>
            </div>
            <button type="submit">Create Course</button>
        </form>
    );
};

export default CreateCourse;
