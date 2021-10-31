import { motion } from 'framer-motion';
import Backdrop from '../../Backdrop';
import { useState } from 'react';
import { updateScore } from '../../../lib/firebase';
import toast from 'react-hot-toast';
import styles from '../../../styles/Modal.module.scss';

const UpdateModal = ({ handleClose, holeId, slug }) => {
    const [score, setScore] = useState(0);
    const [isValid, setIsValid] = useState(false);
    const dropIn = {
        hidden: {
            y: '-100vh',
            opacity: 0,
        },
        visible: {
            y: '0',
            opacity: 1,
            transition: {
                duration: 0.1,
                type: 'spring',
                damping: 25,
                stiffness: 500,
            },
        },
        exit: {
            y: '100vh',
            opacity: 0,
        },
    };

    const handleClick = (e) => {
        const val = e.target.innerHTML.toLowerCase();
        if (val > 0) {
            setScore(val);
            setIsValid(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateScore(slug, score, holeId);
        toast.success(`${holeId}  Updated to ${score}`);
        handleClose();
    };

    return (
        <Backdrop onClick={handleClose}>
            <motion.div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                variants={dropIn}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <form onSubmit={handleSubmit}>
                    <h3>Enter Your Score</h3>
                    <div className={styles.scoreContainer}>
                        {[...Array(10).keys()].map((num) => {
                            return (
                                <div
                                    className={styles.scoreButton}
                                    onClick={handleClick}
                                    key={num + 1}
                                >
                                    {num + 1}
                                </div>
                            );
                        })}
                    </div>
                    <button type="submit" disabled={!isValid}>
                        Save Score
                    </button>
                    <button type="button" onClick={handleClose}>
                        Close
                    </button>
                </form>
            </motion.div>
        </Backdrop>
    );
};

export default UpdateModal;
