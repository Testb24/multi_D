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
    updateDoc,
} from "firebase/firestore";

import { db, app, auth } from '../../../config/firebaseConfig';


const fetchPlayersDataDB = async () => {
    try {
        const q = query(collection(db, "users"));
        // const doc = await getDocs(q);
        // console.log("lecture users")
        // const data = doc.docs[0].data();

        let aaa = [];
        console.log("lecture userS")
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            aaa.push(doc.data());
        });
        return aaa;
    } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
    }
};

const getUserIdDB = async (uid) => {
    const q = query(collection(db, "users"), where("uid", "==", uid))

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        return doc.data().id
    })
}

const updateUserRole = async (uid, role, newRole, add) => {

    if (add) {
        try {
            if (newRole === "hc") {
                role = [...role, "player"]
            }
            const player = doc(db, "users", uid)
            console.log("écriture maj user (add role)")
            await updateDoc(player, {
                role: [...role, newRole]
            });
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    } else {
        try {
            const player = doc(db, "users", uid)
            console.log("écriture maj user (remove role)")
            let temp = role.filter(el => el !== newRole)
            await updateDoc(player, {
                role: temp
            });
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    }

};

export { fetchPlayersDataDB, updateUserRole }