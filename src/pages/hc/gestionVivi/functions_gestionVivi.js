import {
    // getFirestore,
    query,
    getDocs,
    collection,
    where,
    addDoc,
    setDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";

import { db, app, auth } from '../../../config/firebaseConfig';

const fetchPlayersCOA = async (allyArr) => {
    let aaa = [];
    // allyArr.forEach(ally => {
    for (const allyId of allyArr) {
        // console.log(allyId)
        try {
            const q = query(collection(db, "players"), where("Aid", "==", allyId.toString()));
            // const doc = await getDocs(q);
            // const data = doc.docs[0].data();
            console.log("lecture tous les players de l'ally");
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                aaa.push(doc.data());
            });
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data qs45");
        }
        // })
    };
    return aaa;
};
const fetchVivisCOA = async (playerId) => {
    let ans = await CRUD_get_villages(playerId);
    return ans;
};

async function CRUD_get_villages(playerId) {
    let cadran_0 = await CRUD_get_villages_in_one_cadran(0, playerId);
    let cadran_1 = await CRUD_get_villages_in_one_cadran(1, playerId);
    let cadran_2 = await CRUD_get_villages_in_one_cadran(2, playerId);
    let cadran_3 = await CRUD_get_villages_in_one_cadran(3, playerId);
    let cadran_5 = await CRUD_get_villages_in_one_cadran(5, playerId);
    // console.log(cadran_5)
    let ans = cadran_5.concat(cadran_0, cadran_1, cadran_2, cadran_3);
    // console.log(ans)
    // ans = ans.sort((a, b) => a.role - b.role);
    // console.log(ans)
    ans = ans.filter((el, index) => ans.findIndex(e => e._id === el._id) === index);
    // console.log(ans)
    return ans;
}

async function CRUD_get_villages_in_one_cadran(cadran, playerId) {
    try {
        let aaa = []
        const q = query(collection(db, 'villages_' + cadran), where("Uid", "==", playerId.toString()));
        // const doc = await getDocs(q);
        // const data = doc.docs[0].data();
        console.log("lecture tous les vivis du cadran " + cadran + " avec id Un : " + playerId);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            aaa.push(doc.data());
        });
        return aaa;
    } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data qs45");
    }
}

const saveVivi5 = async (vivis) => {
    // console.log("vivis", vivis)
    vivis.forEach(vivi => {
        // console.log(vivi)

        let ref = doc(db, "villages_5", vivi._id)
        setDoc(ref, vivi)
            .then(docRef => {
                alert("nouveaux roles enregistrés")
                console.log("nouveaux roles enregistrés")
            })
            .catch(err => {
                console.error(err);
                console.log(err.message);
                console.log(err);
                alert(" error")
            });
    })
}

export { fetchPlayersCOA, fetchVivisCOA, saveVivi5 }