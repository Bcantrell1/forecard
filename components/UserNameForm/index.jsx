import { useState, useEffect, useContext, useCallback } from 'react';
import { UserContext } from '../../lib/context';

import { firestore } from '../../lib/firebase';
import { writeBatch, getDoc, doc } from 'firebase/firestore';

import UsernameMessage from './components/UsernameMessage';

import { debounce } from 'lodash';
import router, { useRouter } from 'next/router';

const UserNameForm = () => {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { user, username } = useContext(UserContext);

    const onSubmit = async (e) => {
        e.preventDefault();

        // Create refs for both documents
        const userDoc = doc(firestore, `users/${user.uid}`);
        const usernameDoc = doc(firestore, `usernames/${formValue}`);

        // Commit both docs together as a batch write.
        const batch = writeBatch(firestore);
        batch.set(userDoc, {
            username: formValue,
            photoURL: user.photoURL,
            displayName: user.displayName,
        });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();

        router.reload(window.location.pathname);
    };

    const onChange = (e) => {
        // Force form value typed in form to match correct format
        const val = e.target.value.toLowerCase();
        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        // Only set form value if length is < 3 OR it passes regex
        if (val.length < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    //

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    // Check the database for username match after each change
    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = doc(firestore, `usernames/${username}`);
                const queryRef = await getDoc(ref);
                const exists = queryRef.exists();
                console.log('Firestore read executed!');
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input
                        name="username"
                        placeholder="myname"
                        value={formValue}
                        onChange={onChange}
                    />
                    <UsernameMessage
                        username={formValue}
                        isValid={isValid}
                        loading={loading}
                    />
                    <button
                        type="submit"
                        className="btn-green"
                        disabled={!isValid}
                    >
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
};

export default UserNameForm;
