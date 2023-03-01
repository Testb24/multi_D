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

import { db, app, auth } from '../../../config/firebaseConfig';


function Parse_Profil(str) {

    str = str.replace(/\u2212/g, "-").replace(/\r|\n/g, ' ').replace(/[^\x20-\xFF]+/g, ' ').replace(/\s\s+/g, ' ').replace(/\u202d/g, ' ');
    // console.log(str)
    let re_casque = /"helmet":{"typeId":([\d]+),"name":"(.[^}"]+)","attributes":\[{".[^\]]*}],"tier":(\d)/;
    let casque = str.match(re_casque);
    // console.log(casque[1])
    // console.log(casque[2])
    // console.log(casque[3])
    // console.log(casque[1], casque[2], casque[3])

    let re_leftHand = /"leftHand":{"typeId":([\d]+),"name":"(.[^}"]+)","attributes":\[{".[^\]]*}],"tier":(\d)/;
    let leftHand = str.match(re_leftHand);
    // console.log(leftHand[1], leftHand[2], leftHand[3])

    let re_rightHand = /"rightHand":{"typeId":([\d]+),"name":"(.[^}"]+)","attributes":\[{".[^\]]*}],"tier":(\d)/;
    let rightHand = str.match(re_rightHand);
    // console.log(rightHand[1], rightHand[2], rightHand[3])

    let re_body = /"body":{"typeId":([\d]+),"name":"(.[^}"]+)","attributes":\[{".[^\]]*}],"tier":(\d)/;
    let body = str.match(re_body);
    // console.log(body[1], body[2], body[3])

    let re_shoes = /"shoes":{"typeId":([\d]+),"name":"(.[^}"]+)","attributes":\[{".[^\]]*}],"tier":(\d)/;
    let shoes = str.match(re_shoes);
    // console.log(shoes[1], shoes[2], shoes[3])

    let re_horse = /"horse":{"typeId":([\d]+),"name":"(.[^}"]+)","attributes":\[{".[^\]]*}],"tier":(\d)/;
    let horse = str.match(re_horse);
    // console.log(horse[1], horse[2], horse[3])

    let re_att = /"attackerPoints":([\d]+),"def/;
    let re_def = /"defenderPoints":([\d]+)},"villa/;
    let re_xp = /"xp":([\d]+),.*"equipment/;

    let re_id = /{"data":.?{"player":.?{"id":([\d]+),"name":"(.[^"]*)","tribeId":/;
    let id = str.match(re_id);



    let z = {
        ptOff: str.match(re_att)[1],
        ptDef: str.match(re_def)[1],
        xpZ: str.match(re_xp)[1],
        Uid: id[1],
        Un: id[2],
        helmet: {
            id: casque[1],
            description: cleanString(casque[2]),
            tier: casque[3]
        },
        leftHand: {
            id: leftHand[1],
            description: cleanString(leftHand[2]),
            tier: leftHand[3]
        },
        rightHand: {
            id: rightHand[1],
            description: cleanString(rightHand[2]),
            tier: rightHand[3]
        },
        body: {
            id: body[1],
            description: cleanString(body[2]),
            tier: body[3]
        },
        shoes: {
            id: shoes[1],
            description: cleanString(shoes[2]),
            tier: shoes[3]
        },
        horse: {
            id: horse[1],
            description: cleanString(horse[2]),
            tier: horse[3]
        },
    }
    // console.log(z)
    let date = new Date;
    // console.log(date.toLocaleDateString()+ '_' + date.toLocaleTimeString())
    // console.log(date.toString())
    // let idZ = z.Uid + '__' + date.toLocaleDateString() + '__' + date.toLocaleTimeString();
    let idZ = z.Uid + '__' + date.getTime();
    z.time = date.getTime();
    z.id = idZ;
    idZ = idZ.replaceAll('/', ':')
    // console.log(idZ)
    let ref = doc(db, "z", idZ)
    CRUD_post(ref, z)

    return z;
}

function cleanString(str) {

    // let a = "Armure d&#39;\u00e9caille";
    str = str.replaceAll('&#39;', "'");
    str = str.replaceAll('\\u00e9', "é");
    str = str.replaceAll('\\u00c9', "E");
    str = str.replaceAll('\\u00e8', "è");
    console.log("a", str)
    return str
}
// cleanString("asd")
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

export { Parse_Profil, CRUD_post, CRUD_getAll, CRUD_get }