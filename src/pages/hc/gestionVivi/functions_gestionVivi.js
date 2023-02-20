import {
    // getFirestore,
    query,
    getDocs,
    collection,
    where,
    // addDoc,
    setDoc,
    doc,
    // serverTimestamp
} from "firebase/firestore";
import M from 'materialize-css';
import {
    db,
    // app, 
    // auth 
} from '../../../config/firebaseConfig';

const fetchPlayersCOA = async (allyArr) => {
    let aaa = [];
    // allyArr.forEach(ally => {
    for (const allyId of allyArr) {
        // console.log(allyId)
        try {
            const q = query(collection(db, "players"), where("Aid", "==", allyId.toString()));
            // const doc = await getDocs(q);
            // const data = doc.docs[0].data();
            // console.log("lecture tous les players de l'ally");
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                aaa.push(doc.data());
            });
        } catch (err) {
            console.error(err);
            M.toast({ html:"An error occured while fetching user data qs45", displayLength: 4000 });
        }
        // })
    };
    return aaa;
};
const fetchVivisCOA = async (playerId) => {
    let ans = await CRUD_get_villages(playerId);
    return ans;
};
const fetchVivi = async (coo) => {
    let ans = await CRUD_get_villages_coo(coo);
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
async function CRUD_get_villages_coo(coo) {
    let cadran_0 = await CRUD_get_villages_in_one_cadran_byCoo(0, coo);
    let cadran_1 = await CRUD_get_villages_in_one_cadran_byCoo(1, coo);
    let cadran_2 = await CRUD_get_villages_in_one_cadran_byCoo(2, coo);
    let cadran_3 = await CRUD_get_villages_in_one_cadran_byCoo(3, coo);
    let cadran_5 = await CRUD_get_villages_in_one_cadran_byCoo(5, coo);
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
        M.toast({ html:"An error occured while fetching user data qs45", displayLength: 4000 });
    }
}
async function CRUD_get_villages_in_one_cadran_byCoo(cadran, coo) {
    try {
        let aaa = []
        const q = query(collection(db, 'villages_' + cadran), where("X", "==", coo[0].toString()), where("Y", "==", coo[1].toString()));
        // const doc = await getDocs(q);
        // const data = doc.docs[0].data();
        // console.log("lecture vivi du cadran " + cadran + " avec coo : " + coo[0] + "/" + coo[1]);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            aaa.push(doc.data());
        });
        return aaa;
    } catch (err) {
        console.error(err);
        M.toast({ html:"An error occured while fetching user data qs23", displayLength: 4000 });
    }
}
const saveVivi5 = async (vivis) => {
    // console.log("vivis", vivis)
    vivis.forEach(vivi => {
        // console.log(vivi)
        let temp = vivi.role;
        temp = temp.filter((el, index) => index == temp.findIndex(e => e === el));
        // console.log(temp)
        vivi.role = temp;
        // console.log(vivi)

        let ref = doc(db, "villages_5", vivi._id)
        setDoc(ref, vivi)
            .then(docRef => {
                M.toast({ html:"nouveaux roles/troupes enregistrés", displayLength: 4000 });
                console.log("nouveaux roles enregistrés")
            })
            .catch(err => {
                console.error(err);
                console.log(err.message);
                console.log(err);
                M.toast({ html:"erreur18", displayLength: 4000 });
            });
    })
}

export { fetchPlayersCOA, fetchVivisCOA, fetchVivi, saveVivi5 }