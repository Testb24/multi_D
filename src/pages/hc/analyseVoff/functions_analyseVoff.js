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


async function getAll() {

    const attaques = await CRUD_getAll("attaques");

    const spys = await CRUD_getAll("spy");
    const synchros = await CRUD_getAll("synchro");
    const murs = await CRUD_getAll("mur");

    const infos = await CRUD_getAll("infos");

    return { attaques, spys, synchros, murs, infos }
}

async function CRUD_getAll(bank) {
    // console.log("lecture all" + bank)
    try {
        let sortie = [];
        const querySnapshot = await getDocs(collection(db, bank));
        querySnapshot.forEach((doc) => {
            sortie.push(doc.data());
        });
        return sortie;
    } catch (err) {
        console.error(err);
        alert("An error occured while fetching " + bank);
        return [];
    }

}

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

function expliciteSecondes(s) {
    let n = s
    let ans = (Math.floor(n / 3600) < 10 ? '0' : '') + Math.floor(n / 3600) + ':';
    n = n % 3600;
    ans += (Math.floor(n / 60) < 10 ? '0' : '') + Math.floor(n / 60) + ':';
    n = n % 60;
    ans += (Math.floor(n / 1) < 10 ? '0' : '') + Math.floor(n / 1);
    return ans;
}
function distanceDeuxPoints(a, b) {

    let x = a.X - b.X
    let y = a.Y - b.Y
    let ans = Math.sqrt(x * x + y * y)
    return ans;
}

function distanceDeuxVivis(a, b) {
    const d = 401 //dim de la carte

    let d1 = distanceDeuxPoints(a, b);

    let d2 = distanceDeuxPoints(a, { X: b.X + d, Y: b.Y });
    let d3 = distanceDeuxPoints(a, { X: b.X - d, Y: b.Y });
    let d4 = distanceDeuxPoints(a, { X: b.X, Y: b.Y + d });
    let d5 = distanceDeuxPoints(a, { X: b.X, Y: b.Y - d });

    let d6 = distanceDeuxPoints(a, { X: b.X + d, Y: b.Y + d });
    let d7 = distanceDeuxPoints(a, { X: b.X - d, Y: b.Y + d });
    let d8 = distanceDeuxPoints(a, { X: b.X + d, Y: b.Y - d });
    let d9 = distanceDeuxPoints(a, { X: b.X - d, Y: b.Y - d });

    // console.log(d1, d2, d3, d4, d5)
    return Math.min(d1, d2, d3, d4, d5, d6, d7, d8, d9);
}

function allertMessage(arrPathTime) {
    // console.log(arrPathTime)
    // console.log("first", arrPathTime.find(el => el.speed.includes(4)))

    let ans3 = arrPathTime.find(el => el.speed.includes(3))
    let ans4 = arrPathTime.find(el => el.speed.includes(4))
    let ans5 = arrPathTime.find(el => el.speed.includes(5))
    // console.log("ans", ans)
    if (ans3) {
        return "alerte speed 3"
    } else if (ans4) {
        return "alerte speed 4"
    } else if (ans5) {
        return "alerte speed 5"
    } else {
        return false
    }
}


function tempsTrajet_byPt(a, b, pathTime, maxTime = pathTime + 3600 * 10, artefact = 1) {
    // console.log("start function disparue")
    // console.log("artefact", artefact)
    // console.log("maxTime", maxTime)
    // console.log("pathTime", pathTime)
    let dist = distanceDeuxVivis(a, b);

    if (dist > 20) {
        dist -= 20;
        let ans = []
        let pt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        let vitesse = [3, 4, 5];

        pt.forEach(lvl => {
            let ansV = []
            vitesse.forEach(v => {
                let time = (20 / (v * artefact) + dist / (v * artefact * (1 + 0.2 * lvl))) * 3600;
                // console.log(Math.floor(time), pathTime, time > pathTime && time < maxTime)
                if (time > pathTime) {
                    // if (maxTime !== null) {
                    if (time < maxTime) {
                        ansV.push(v);
                    }
                    // } else {
                    // ansV.push(v);
                    // }
                }
            })
            if (ansV.length > 0)
                ans.push({ pt: lvl, speed: ansV })
        })
        // console.log(ans)
        return ans;
    } else {
        // console.log([{ pt: 0, speed: [Math.floor((dist / pathTime) * 3600)] }])
        return [{ pt: "???", speed: [Math.floor((dist / pathTime) * 3600)] }];
    }
}
function tempsTrajet_bySpeed(a, b, pathTime, maxTime = pathTime + 10 * 3600, artefact = 1) {
    // console.log("artefact", artefact)
    let dist = distanceDeuxVivis(a, b);

    if (dist > 20) {
        dist -= 20;
        let ans = []
        let pt = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        let vitesse = [3, 4, 5];

        vitesse.forEach(v => {
            let ansPt = []
            pt.forEach(lvl => {
                let time = (20 / (v * artefact) + dist / (v * artefact * (1 + 0.2 * lvl))) * 3600;
                // console.log(time * 3600, pathTime)
                if (time > pathTime && time < maxTime) {
                    ansPt.push(lvl);
                }
            })
            if (ansPt.length > 0)
                ans.push({ pt: ansPt, speed: v })
        })

        return ans;
    } else {
        return [{ speed: [(dist / pathTime) * 3600] }];
    }
}

const saveVivi5 = async (vivis) => {
    // console.log("vivis", vivis)
    vivis.forEach(vivi => {
        // console.log(vivi)

        let ref = doc(db, "villages_5", vivi._id)
        setDoc(ref, vivi)
            .then(docRef => {
                alert("nouveaux lvl pt enregistrés")
                console.log("nouveaux lvl pt enregistrés")
            })
            .catch(err => {
                console.error(err);
                console.log(err.message);
                console.log(err);
                alert(" error")
            });
    })
}

function scalaire(a, b) {
    let ans = 0;
    a.map((el, index) => b[index] ? ans += el : null)
    return ans;
}

function calcul_tps_trajet(pt, speedSearched, attaque) {

    let speed = speedSearched
    let tps_trajet = null;
    // console.log(speed)
    if (parseInt(speed) === 0 || speed === undefined) {
        tps_trajet = "/"
    } else {
        let a = attaque.off
        let b = attaque.def
        let dist = distanceDeuxVivis(a, b);
        // console.log(dist)
        if (dist > 20) {

            tps_trajet = 20 / speed;
            dist -= 20;

            tps_trajet += dist / (speed * (1 + 0.2 * pt))

        } else {
            tps_trajet = dist / speed;
        }
    }
    // console.log(tps_trajet)
    if (tps_trajet !== "/") {
        // let hours = Math.floor(tps_trajet * 100) / 100;
        // console.log(tps_trajet);
        let hours = Math.floor(tps_trajet);
        // console.log(hours);
        let min = Math.floor((tps_trajet - hours) * 60);
        // console.log(min);
        let sec = Math.floor(((tps_trajet - hours) * 60 - min) * 60);
        const date = (new Date(attaque.time.impact));
        (date.setHours(date.getHours() - hours));
        (date.setMinutes(date.getMinutes() - min));
        (date.setSeconds(date.getSeconds() - sec));
        // return date.toLocaleString();

        if (date.getDate() === (new Date(attaque.time.impact)).getDate()) {
            return date.toLocaleTimeString()
        } else {
            return date.toLocaleString()
        }
    } else {
        return tps_trajet;
    }



}
function saveSpy(attaque) {
    let ref = doc(db, "spy", attaque.id)
    console.log("écriture spy")
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
            alert("spy enregistré")
        })
        .catch(err => {
            console.error(err);
            console.log(err.message);
            console.log(err);
            alert("spy error")
        });
}
export { saveSpy,CRUD_getAll, CRUD_get, expliciteSecondes, distanceDeuxVivis, distanceDeuxPoints, allertMessage, tempsTrajet_byPt, saveVivi5, calcul_tps_trajet }