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
import M from 'materialize-css';
import { db, app, auth } from '../../../config/firebaseConfig';

async function CRUD_post(ref, object) {

    setDoc(ref, object)
        .then(docRef => {
            console.log(object.type + " enregistrĂ©")
            M.toast({ html:object.type + " enregistrĂ©", displayLength: 4000 });
            console.log(object.type + " enregistrĂ©")
        })
        .catch(err => {
            console.error(err);
            console.log(err.message);
            console.log(err);
            console.log(object.type + " error")
            M.toast({ html:object.type + " error", displayLength: 4000 });
        });
}

function saveMur(village) {

    let ref = doc(db, "mur", village.def.X + '_' + village.def.Y)

    const tempOff = []
    let firstImpact = village.attaques[0].time.impact;
    village.attaques.forEach(attaque => {
        tempOff.push(attaque.off)
        firstImpact = Math.min(firstImpact, attaque.time.impact)
    })

    const murToPost = {
        firstImpact: firstImpact,
        remplissage: 0,
        assist: JSON.stringify([]),
        valide: false,

        troupesObj: 0,
        def: village.def,
        off: tempOff,
        type: "mur",
        timestamp: serverTimestamp(),
        id: village.def.X + '_' + village.def.Y,
    };

    CRUD_post(ref, murToPost);
}

function saveSynchro(attaque, index) {
    let ref = doc(db, "synchro", attaque.id + "_" + index)

    const synchroToPost = {
        ...attaque,
        impact: parseInt(attaque.time.impact) + index * 1000,
        assist: JSON.stringify([]),

        troupesObj: 0,
        def: attaque.def,
        off: attaque.off,
        type: "synchro",
        timestamp: serverTimestamp(),
        id: attaque.id + "_" + index,
    }

    CRUD_post(ref, synchroToPost);
}

function saveSpy(attaque) {
    let ref = doc(db, "spy", attaque.id)
    console.log("Ă©criture spy")
    setDoc(ref, {
        ...attaque,

        etat: false,
        // joueur: "",
        impact: "",
        info: "",
        commentaire: "",

        troupesObj: 0,
        // def: attaque.def,
        // off: attaque.off,
        type: "spy",
        timestamp: serverTimestamp(),
        id: attaque.id,
    })
        .then(docRef => {
            console.log("spy enregistrĂ©")
            M.toast({ html:"spy enregistrĂ©", displayLength: 4000 });
        })
        .catch(err => {
            console.error(err);
            console.log(err.message);
            console.log(err);
            console.log("spy error")
            M.toast({ html:"spy error", displayLength: 4000 });
        });
}

async function getAll() {

    const attaques = await CRUD_getAll("attaques");

    const spys = await CRUD_getAll("spy");
    const synchros = await CRUD_getAll("synchro");
    const murs = await CRUD_getAll("mur");

    const infos = await CRUD_getAll("infos");

    return { attaques, spys, synchros, murs, infos }
}

async function CRUD_getAll(bank) {
    console.log("lecture all" + bank)
    try {
        let sortie = [];
        const querySnapshot = await getDocs(collection(db, bank));
        querySnapshot.forEach((doc) => {
            sortie.push(doc.data());
        });
        return sortie;
    } catch (err) {
        console.error(err);
        console.log("An error occured while fetching " + bank);
        M.toast({ html:"An error occured while fetching " + bank, displayLength: 4000 });
        return [];
    }

}

async function buildTownData() {
    const { attaques, spys, synchros, murs, infos } = await getAll();

    // attaques.sort((a, b) => a.time.impact < b.time.impact)
    // attaques.sort((a, b) => a.def.X < b.def.X)
    // attaques.sort((a, b) => a.def.Y < b.def.Y)

    const townData = []
    const data = [...attaques, ...spys, ...synchros, ...murs, ...infos]
    const idDef = [];
    data.forEach(el => idDef.push(el.def))
    // console.log("all")
    // console.log(idDef)

    const refTemp = [];

    const uniqueArray = idDef.filter(function (item, pos, self) {
        // console.log(item)
        refTemp.push(item.X + '_' + item.Y)
        return !refTemp.slice(0, -1).includes(item.X + '_' + item.Y);
    })
    // console.log("filtered")
    // console.log(uniqueArray)

    const finalArray = [];
    uniqueArray.filter(el => el !== undefined).forEach((el, index) => {
        // console.log(el)
        const town = {
            attaques: attaques.filter(attaque => attaque.def.X === el.X && attaque.def.Y === el.Y),
            spys: spys.filter(spy => spy.def.X === el.X && spy.def.Y === el.Y),
            synchros: synchros.filter(synchro => synchro.def.X === el.X && synchro.def.Y === el.Y),
            murs: murs.find(mur => mur.def.X === el.X && mur.def.Y === el.Y),
            infos: infos.find(info => info.def.X === el.X && info.def.Y === el.Y),
            def: el
        }
        finalArray.push(town);
    })

    // console.log("final obj")
    // console.log(finalArray)

    return finalArray;
}

export { saveMur, saveSynchro, saveSpy, getAll, buildTownData }