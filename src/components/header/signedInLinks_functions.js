import M from 'materialize-css';
import {
    // getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    setDoc,
    doc,
    serverTimestamp,
    getDoc
} from "firebase/firestore";

import { db, app, auth } from '../../config/firebaseConfig';


async function CRUD_get(bank, id) {
    // console.log("lecture " + bank + " / id " + id)

    const docRef = doc(db, bank, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());

        return docSnap.data();

    } else {
        console.log("No such document!");
    }
}

export { CRUD_get }