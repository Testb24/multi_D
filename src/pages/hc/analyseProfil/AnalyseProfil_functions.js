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
    getDoc,
    deleteDoc
} from "firebase/firestore";

import { db, app, auth } from '../../../config/firebaseConfig';

async function CRUD_post(ref, object) {

    setDoc(ref, object)
        .then(docRef => {
            M.toast({ html: "z" + " enregistré", displayLength: 3000 });
            console.log("z" + " enregistré")
        })
        .catch(err => {
            console.error(err);
            console.log(err.message);
            console.log(err);
            M.toast({ html: object.type + " error", displayLength: 4000 });
        });
}

async function CRUD_getAll(bank) {
    // console.log("lecture all " + bank)
    try {
        let sortie = [];
        const querySnapshot = await getDocs(collection(db, bank));
        querySnapshot.forEach((doc) => {
            sortie.push(doc.data());
        });
        return sortie;
    } catch (err) {
        console.error(err);
        M.toast({ html: "An error occured while fetching " + bank, displayLength: 4000 });
        return [];
    }

}

async function CRUD_get(bank, id) {
    console.log("lecture " + bank + " / id " + id)

    const docRef = doc(db, bank, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());

        return docSnap.data();

    } else {
        console.log("No such document!");
    }
}

function cleanIntervalle(temp, Uid) {

    let a = temp.filter(el => el.Uid === Uid).sort((a, b) => a.time - b.time)
    // console.log(a)

    let indexElToRemove = []
    for (let k = 1; k < a.length - 1; k++) {
        if (
            a[k - 1].Uid === a[k].Uid && a[k].Uid === a[k + 1].Uid &&
            a[k - 1].Un === a[k].Un && a[k].Un === a[k + 1].Un &&
            a[k - 1].ptDef === a[k].ptDef && a[k].ptDef === a[k + 1].ptDef &&
            a[k - 1].ptOff === a[k].ptOff && a[k].ptOff === a[k + 1].ptOff &&
            a[k - 1].xpZ === a[k].xpZ && a[k].xpZ === a[k + 1].xpZ &&
            a[k - 1].body.id === a[k].body.id && a[k].body.id === a[k + 1].body.id &&
            a[k - 1].helmet.id === a[k].helmet.id && a[k].helmet.id === a[k + 1].helmet.id &&
            a[k - 1].horse.id === a[k].horse.id && a[k].horse.id === a[k + 1].horse.id &&
            a[k - 1].leftHand.id === a[k].leftHand.id && a[k].leftHand.id === a[k + 1].leftHand.id &&
            a[k - 1].rightHand.id === a[k].rightHand.id && a[k].rightHand.id === a[k + 1].rightHand.id &&
            a[k - 1].shoes.id === a[k].shoes.id && a[k].shoes.id === a[k + 1].shoes.id
        ) {
            console.log("reccord à effacer")
            console.log(a[k].id)
            CRUD_delete("z", a[k].id);
            a.splice(k, 1);
            k--;
        }
    }

    // for (let k = indexElToRemove.length; k > 0; k--) {
    //     console.log("k", k)
    //     a.splice(indexElToRemove[k], 1);
    // }



    return a;

}

async function CRUD_delete(bank, id) {
    console.log("delete " + bank + " / id " + id)

    try {
        await deleteDoc(doc(db, bank, id));
    } catch (error) {
        M.toast({ html: bank + " supprimé avec succès (" + id + ")", displayLength: 4000 });
    }
}

export { CRUD_post, CRUD_getAll, CRUD_get, cleanIntervalle }