import {
    GoogleAuthProvider,
    // getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import M from 'materialize-css';
import {
    // getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    setDoc,
    updateDoc,
    doc
} from "firebase/firestore";

import { db, app, auth } from './firebaseConfig';

const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        console.log(err.message);
        M.toast({ html:"erreur", displayLength: 4000 });
    }
};

const registerWithEmailAndPassword = async (compte = '', pseudo = '', email, password) => {
    // try {
    //     const res = await createUserWithEmailAndPassword(auth, email, password);
    //     const user = res.user;
    //     await addDoc(collection(db, "users"), {
    //         uid: user.uid,
    //         pseudo,
    //         compte,
    //         authProvider: "local",
    //         email,
    //         role
    //     });
    // } catch (err) {
    //     console.error(err);
    // }
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        // await setDoc(collection(db, "users", user.uid), {
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            pseudo,
            compte,
            authProvider: "local",
            email,
            role: ["public"]
        });
    } catch (err) {
        console.error(err);
        console.log(err.message);
        M.toast({ html:"erreur", displayLength: 4000 });
    }
};



const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        M.toast({ html:"Password reset link sent!", displayLength: 4000 });
    } catch (err) {
        console.error(err);
        console.log(err.message);
        M.toast({ html:"erreur", displayLength: 4000 });
    }
};

const logout = () => {
    signOut(auth);
};

export {
    auth,
    db,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
}