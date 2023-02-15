import {
    query,
    getDocs,
    collection,
    where,
    addDoc,
    setDoc,
    doc,
    serverTimestamp,
    deleteDoc,
    onSnapshot,
    getDoc,
    FieldValue,
    increment,
    updateDoc
} from "firebase/firestore";

import { db, app, auth } from '../../config/firebaseConfig';

async function CRUD_get(bank, id) {
    console.log("lecture " + bank + " / id " + id)

    const docRef = doc(db, bank, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        if (bank === "mur") {
            return { ...docSnap.data(), assist: JSON.parse(docSnap.data().assist) }
        } else {
            return docSnap.data();
        }

    } else {
        console.log("No such document!");
    }
}
async function CRUD_put(bank, object) {
    console.log("maj " + bank + " / id " + object.id)
    //pour ne pas modifier l'object de base si c'est un mur
    const objectTemp = object;
    if (bank === "mur") {
        if (typeof objectTemp.assist === "object") {
            objectTemp.assist = JSON.stringify(objectTemp.assist)
        }
    }

    const ref = doc(db, bank, objectTemp.id);
    setDoc(ref, objectTemp)
        .then(docRef => {
            alert(bank + " mis à jour avec succès")
        })
        .catch(err => {
            console.error(err);
            console.log(err.message);
            console.log(err);
            alert(bank + " mise à jour : ERROR")
        });
}
async function CRUD_delete(bank, id) {
    console.log("delete " + bank + " / id " + id)

    db.collection(bank).doc(id).delete()
        .then(docRef => {
            alert("mur supprimé avec succès")
        })
        .catch(err => {
            console.error(err);
            console.log(err.message);
            console.log(err);
            alert("suppression : ERROR")
        });
}
async function CRUD_getAll(bank) {
    console.log("lecture all " + bank)
    try {
        let sortie = [];
        const querySnapshot = await getDocs(collection(db, bank));
        querySnapshot.forEach((doc) => {
            if (bank === "mur") {
                sortie.push({ ...doc.data(), assist: JSON.parse(doc.data().assist) });
            } else {
                sortie.push(doc.data());
            }

        });
        return sortie;
    } catch (err) {
        console.error(err);
        alert("An error occured while fetching " + bank);
        return [];
    }

}
function get_remplissage_from_mur(troops, obj) {
    let assist = troops
    if (typeof assist === "string") {
        assist = JSON.parse(assist);
    }
    if (obj === 0) {
        return 0;
    }
    let s = 0;
    const conso = [1, 2, 3, 1, 1, 3, 1, 2]
    assist.forEach(ligne => {
        // console.log(ligne)
        ligne.slice(2).map((e, i) => s += parseInt(e) * conso[i])
    })
    // console.log(Math.floor(Math.round(s / (obj) * 1000)) / 1000)
    return Math.floor(Math.round(s / (obj) * 1000)) / 1000;
}

async function updateMur(mur) {
    // console.log(mur)
    const bank = mur.type;
    const mur_fresh = await CRUD_get(bank, mur.id);

    mur_fresh.remplissage = get_remplissage_from_mur(mur_fresh.assist, mur.troupesObj);
    //======================
    // console.log(get_remplissage_from_mur(mur_fresh.assist,mur.troupesObj))
    // const newMur = { ...mur_fresh, timestamp: serverTimestamp(), troupesObj: mur.troupesObj, remplissage:  get_remplissage_from_mur(mur_fresh.assist,mur.troupesObj) }

    CRUD_put(bank, { ...mur_fresh, timestamp: serverTimestamp(), troupesObj: mur.troupesObj, remplissage: get_remplissage_from_mur(mur_fresh.assist, mur.troupesObj) });
}

function validateMur(mur) {
    CRUD_put(mur.type, { ...mur, timestamp: serverTimestamp(), valide: true })
}

async function deleteMur(mur) {

    const mur2 = await CRUD_get(mur.type, mur.id);

    if (mur2.assist === []) {
        CRUD_delete(mur.type, mur.id);
    } else {
        CRUD_put(mur.type, { ...mur2, timestamp: serverTimestamp(), valide: "annule" })
    }


}

async function getAll() {

    const spys = await CRUD_getAll("spy");
    const synchros = await CRUD_getAll("synchro");
    const murs = await CRUD_getAll("mur");
    // console.log(murs)
    // const murs = [];
    // mursBrut.forEach(mur => murs.push({ ...mur, assist: JSON.parse(mur.assist) }))
    // console.log(mursClean)
    return { spys, synchros, murs }
}

async function updateTroopsMur(user, troupes, mur) {

    let bank = mur.type;
    const freshMur = await CRUD_get(bank, mur.id);

    const troopsSansUser = freshMur.assist.filter(el => {
        return !(el[0] === user.pseudo && el[1] === user.compte);
    });

    const allTroops = [...troopsSansUser, [user.pseudo, user.compte, ...troupes]]

    const freshMurUpdated = { ...freshMur, timestamp: serverTimestamp(), assist: allTroops, remplissage: get_remplissage_from_mur(allTroops, freshMur.troupesObj) }

    CRUD_put(bank, { ...freshMur, timestamp: serverTimestamp(), assist: allTroops, remplissage: get_remplissage_from_mur(allTroops, freshMur.troupesObj) })
    return freshMurUpdated;
}

async function saveIncrement(user, mur, troupes, index) {
    let bank = mur.type;


    const ref = doc(db, bank, mur.id);
    // const ref = db.collection(bank).doc(mur.id);
    let field = user.pseudo + "__" + index;
    await updateDoc(ref, { [field]: increment(troupes) })

    const freshMur = await CRUD_get(bank, mur.id);
    // setDoc(ref, objectTemp)
    //     .then(docRef => {
    //         alert(bank + " mis à jour avec succès")
    //     })
    //     .catch(err => {
    //         console.error(err);
    //         console.log(err.message);
    //         console.log(err);
    //         alert(bank + " mise à jour : ERROR")
    //     });


    // CRUD_put(bank, { ...freshMur, timestamp: serverTimestamp(), assist: allTroops, remplissage: get_remplissage_from_mur(allTroops, freshMur.troupesObj) })
    return freshMur;
}

async function deleteLigneMur__old(user, ligne, mur) {

    let bank = mur.type;
    const freshMur = await CRUD_get(bank, mur.id);

    const troopsSansUser = freshMur.assist.filter(el => {
        return !(el[0] === user.pseudo && el[1] === user.compte);
    });

    const freshMurUpdated = { ...freshMur, timestamp: serverTimestamp(), assist: troopsSansUser }

    CRUD_put(bank, { ...freshMur, timestamp: serverTimestamp(), assist: troopsSansUser })

    return freshMurUpdated;
}

async function deleteLigneMur(user, mur) {

    let bank = mur.type;
    let str = user.pseudo + "__";
    CRUD_put(bank, { ...mur, timestamp: serverTimestamp(), [str + 0]: 0, [str + 1]: 0, [str + 2]: 0, [str + 3]: 0, [str + 4]: 0, [str + 5]: 0, [str + 6]: 0, [str + 7]: 0 })

    const freshMur = await CRUD_get(bank, mur.id);
    return freshMur;
}

async function updateSpy(spy, newData, userData) {

    const spyUpdated = {
        ...spy,

        etat: false,
        joueur: userData.pseudo + '/' + userData.compte,
        impact: newData.impact,
        commentaire: newData.comment === undefined ? "" : newData.comment
    }

    CRUD_put("spy", spyUpdated);
}

function updateSpyWithoutDataPlayer(spy) {

    const spyUpdated = {
        ...spy,

        etat: false,
        joueur: "",
        impact: "",
        commentaire: ""
    }

    CRUD_put("spy", spyUpdated);
}

export { updateMur, deleteMur, validateMur, getAll, updateTroopsMur, deleteLigneMur, CRUD_get, CRUD_getAll, updateSpy, updateSpyWithoutDataPlayer, saveIncrement }