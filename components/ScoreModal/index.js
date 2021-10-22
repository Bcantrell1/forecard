import { motion } from 'framer-motion';
import Backdrop from '../Backdrop';

import styles from '../../styles/Modal.module.scss';

const Modal = ({ handleClose, text }) => {
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
                <p>{text}</p>
                <button onClick={handleClose}>Close</button>
            </motion.div>
        </Backdrop>
    );
};

export default Modal;
