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
import { db, app, auth } from '../../config/firebaseConfig';

function saveAttacks(attaques, cleanTime) {

    attaques.forEach(a => {

        // console.log((Date.parse(a.time_impact) - cleanTime)/1000-a.time_path)

        const attaque = {
            id: a._id,
            off: {
                X: a.Voff_X,
                Y: a.Voff_Y
            },
            def: {
                X: a.Vdef_X,
                Y: a.Vdef_Y
            },
            time: {
                server: Date.parse(a.time_server),
                path: a.time_path,
                impact: Date.parse(a.time_impact),
                cleanTime: (Date.parse(a.time_impact) - cleanTime) / 1000
            },
            detail: {
                troupes: a.troupes,
                vague: a.vague.length > 1 ? changeVagueFormat(a.vague) : a.vague,
                numero: a.numero,
                speed: 0
            }
        }
        saveatt(attaque)
    });

}

function changeVagueFormat(vagueStr) {

    let ans = []
    vagueStr.split('=').forEach(nbr => ans.push(parseInt(nbr)));
    return ans
}

const saveatt = async (attaque) => {

    const q = query(collection(db, "attaques"), where("id", "==", attaque.id));

    let oldAttacks = null;
    const querySnapshot = await getDocs(q);
    console.log("lecture");
    querySnapshot.forEach((doc) => {
        oldAttacks = doc.data();
    });

    if (oldAttacks === null) {
        console.log("aucune old attaque");
    }

    if (oldAttacks === null) {
        let data1 = attaque
        let ref = doc(db, "attaques", attaque.id)
        // console.log(attaque.id)
        // console.log(data1)

        console.log("écriture")
        setDoc(ref, { ...data1, timestamp: serverTimestamp() })
            .then(docRef => {
            })
            .catch(err => {
                console.error(err);
                console.log(err.message);
                console.log(err);
            });
    }

}

async function getAttacks() {
    const q = query(collection(db, "attaques"));

    let attacks = [];
    console.log("lecture toutes les attaques 1")
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot.length)
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        attacks.push(doc.data());
    });

    console.log("============aaa")
    console.log(attacks)
    return attacks
}

const fetchAttacksDataDB = async () => {
    try {
        const q = query(collection(db, "attaques"));
        // const doc = await getDocs(q);
        // const data = doc.docs[0].data();
        console.log("lecture toutes les attaques 2")
        let aaa = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            aaa.push(doc.data());
        });
        return aaa;
    } catch (err) {
        console.error(err);
        
            M.toast({ html:"An error occured while fetching user data10", displayLength: 4000 });
    }
};

function Parse_PR(pr) {
    // if (pr == "") { console.log("pr vide en entrée") } else { console.log("pr non vide") };
    var pr = pr.replace(/\u2212/g, "-").replace(/\r|\n/g, ' ').replace(/[^\x20-\xFF]+/g, ' ').replace(/\s\s+/g, ' ').replace(/\u202d/g, ' ');
    // console.log(pr);
    // if (pr == "") { console.log("pr vide en entrée après nettoyage") } else { console.log("pr clean") };
    //=============  TEMP SERVEUR  ========================
    var temp = pr.match(/Heure du serveur ?: (\d{1,2}):(\d{2}):(\d{2})/);
    if (temp == null)
        temp = pr.match(/Heure locale ?: (\d{1,2}):(\d{2}):(\d{2})/);
    // if (temp == "") { console.log("pas d'heure serveur") } else { console.log("ok H serveur") };
    var time_server = new Date();
    // console.log(temp)
    time_server.setSeconds(temp[3]);
    time_server.setMinutes(temp[2]);
    time_server.setHours(temp[1]);
    time_server.setMilliseconds(0);
    // if (time_server == "") { console.log("pb heure") } else { console.log("ok save heure") };
    // console.log(time_server)
    // console.log(Date.parse(time_server))
    // console.log(temp);

    // console.log(pr)
    //=============  VIVI OFF : X / Y  ========================
    // var re_one = new RegExp('attaque (.{1,20}) \\((-*\\d{1,3})\\|(-*\\d{1,3})\\).{110,180} {0,1}([?\\d{1,2}] {0,1}[?\\d{1,2}] {0,1}[?\\d{1,2}] {0,1}[?\\d{1,2}] {0,1}[?\\d{1,2}] {0,1}[?\\d{1,2}] {0,1}[?\\d{1,2}] {0,1}[?\\d{1,2}] {0,1}[?\\d{1,2}] {0,1}[?\\d{1,2}] {0,1}[?\\d{1,2}]) Arrivée {0,1}dans (\\d{1,2}):(\\d{1,2}):(\\d{1,2}) h {0,1}à (\\d{1,2}):(\\d{1,2}):(\\d{1,2})');
    // var re_one = new RegExp('attaque (.{1,20}) \\( ?(-? ?\\d{1,3}) ?\\| ?(-? ?\\d{1,3}) ?\\)(?:[\'a-zA-Zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ ]{110,200}) ((?:[\\?|\\d]{1,2} ){11})Arrivée ?dans (\\d{1,2}):(\\d{1,2}):(\\d{1,2}) h ?à (\\d{1,2}):(\\d{1,2}):(\\d{1,2})');
    var re_one = new RegExp('attaque (.{1,20}) \\( ?(-? ?\\d{1,3}) ?\\| ?(-? ?\\d{1,3}) ?\\)[^0-9]{110,180} ((?:[\\?|\\d]{1,2} ){11})Arrivée ?dans (\\d{1,2}):(\\d{1,2}):(\\d{1,2}) h ?à (\\d{1,2}):(\\d{1,2}):(\\d{1,2})');
    var Attaque = ["Attaque"];
    // console.log("aaa");
    // console.log(re_one);
    // var re = new RegExp('attaque .{1,20} \\(-*\\d{1,3}\\|-*\\d{1,3}\\).{110,200} Arrivée {0,1}dans \\d{1,2}:\\d{1,2}:\\d{1,2} h {0,1}à \\d{1,2}:\\d{1,2}:\\d{1,2}', 'g');
    var re = new RegExp('attaque .{1,20} \\( ?-? ?\\d{1,3} ?\\| ?-? ?\\d{1,3} ?\\).{110,200} Arrivée {0,1}dans \\d{1,2}:\\d{1,2}:\\d{1,2} h {0,1}à \\d{1,2}:\\d{1,2}:\\d{1,2}', 'g');
    var pr_attaque = pr.match(re);
    // console.log(re);
    // console.log(pr);
    // console.log(pr_attaque);
    // if (pr_attaque === null) { console.log("pb regexp attaque => 0 attaque trouvée") } else { console.log("ok 3") };
    // console.log(pr_attaque);
    // console.log(re_one);
    var i = 0;
    for (i = 0; i < pr_attaque.length; i++) {
        var temp = pr_attaque[i].match(re_one);
        console.log(temp)
        var Nom_Village = temp[1];
        var Voff_X = parseInt(temp[2].replace(" ", ''), 10);
        var Voff_Y = parseInt(temp[3].replace(" ", ''), 10);
        var troupes = temp[4];
        var dans_hour = temp[5];
        var dans_min = temp[6];
        var dans_sec = temp[7];
        var time_impact_hour = temp[8];
        var time_impact_min = temp[9];
        var time_impact_sec = temp[10];

        // console.log("nom avant clean : " + Nom_Village);
        Nom_Village = clean_nom_de_village(Nom_Village);
        // console.log("nom APRES clean : " + Nom_Village);

        // console.log("TEMP : " + temp)
        var time_impact = new Date(time_server.getTime() + 3600 * 1000 * dans_hour + 60 * 1000 * dans_min + 1000 * dans_sec);
        // console.log(time_impact);
        // time_impact.setMilliseconds(0);
        // console.log(time_impact);
        // time_impact = (temp[5].length < 2 ? '0' + temp[5] : temp[5]) + ':' + (temp[6].length < 2 ? '0' + temp[6] : temp[6]) + ':' + (temp[7].length < 2 ? '0' + temp[7] : temp[7]);
        // console.log(time_impact);
        var time_path = 3600 * parseInt(dans_hour) + 60 * parseInt(dans_min) + parseInt(dans_sec);
        // console.log(time_path)
        // console.log(Nom_Village)
        var re2 = new RegExp('\\( ?-? ?\\d{1,3} ?\\| ?-? ?\\d{1,3} ?\\) ' + Nom_Village + ' \\( ?(-? ?\\d{1,3}) ?\\| ?(-? ?\\d{1,3}) ?\\)')
        var tempre = pr.match(re2);
        // console.log("re2 : " + re2);
        // console.log("pr : " + pr);
        //   console.log("tempre : " + tempre)

        let v2 = true;
        if (tempre == null) {
            v2 = false;
            var re3 = new RegExp('(Villages)|(VILLAGES): \\d{1,2} *\\/ *\\d{1,2}.' + Nom_Village + ' {1,10}\\(( *-*\\d{1,3}.)\\|( *-*\\d{1,3} *)\\)');
            // console.log("re3 : " + re3);
            // console.log(pr);
            var tempre = pr.match(re3);
        }
        // console.log(tempre)
        // console.log(tempre[1])
        // console.log(tempre[2])
        // console.log(tempre);

        var Vdef_X
        var Vdef_Y
        // var Vdef_X = parseInt(tempre[1 + 0].replace(" ", ''), 10);
        // var Vdef_Y = parseInt(tempre[2 + 0].replace(" ", ''), 10);

        // var Vdef_X = parseInt(tempre[3].replace(" ", ''), 10);
        // var Vdef_Y = parseInt(tempre[4].replace(" ", ''), 10);

        if (v2) {
            Vdef_X = parseInt(tempre[1 + 0].replace(" ", ''), 10);
            Vdef_Y = parseInt(tempre[2 + 0].replace(" ", ''), 10);

        } else {
            Vdef_X = parseInt(tempre[3].replace(" ", ''), 10);
            Vdef_Y = parseInt(tempre[4].replace(" ", ''), 10);

        }
        var attaque = {
            Vdef_X: Vdef_X,
            Vdef_Y: Vdef_Y,
            Voff_X: Voff_X,
            Voff_Y: Voff_Y,
            time_server: time_server,
            time_impact: time_impact,
            time_path: time_path,
            vague: 1,
            troupes: troupes,
            numero: (Attaque.length),
            _id: Vdef_X + ':' + Vdef_Y + '_' + Voff_X + ':' + Voff_Y + '_' + time_impact.getTime()
        }

        Attaque.push(attaque);

    }
    var i = 1;
    var j = 2;
    for (i = 1; i < Attaque.length; i++) {
        for (j = i + 1; j < Attaque.length; j++) {
            // console.log(Attaque[i])
            // console.log(Attaque[j])

            // if (Attaque[i]["time_impact"].getTime() === Attaque[j]["time_impact"].getTime() &&
            if (Attaque[i]["time_path"] === Attaque[j]["time_path"] &&
                Attaque[i]["Vdef_X"] === Attaque[j]["Vdef_X"] &&
                Attaque[i]["Vdef_Y"] === Attaque[j]["Vdef_Y"] &&
                Attaque[i]["Voff_X"] === Attaque[j]["Voff_X"] &&
                Attaque[i]["Voff_Y"] === Attaque[j]["Voff_Y"]) {

                Attaque[i]["vague"] = Attaque[i]["vague"] + Attaque[j]["vague"]
                Attaque[j]["vague"] = 0

            }
        }
    }

    var Attaque1 = [];
    for (i = 1; i < Attaque.length; i++) {
        if (Attaque[i]["vague"] > 0) {
            Attaque1.push(Attaque[i]);
        }
    }
    Attaque1 = change_format_attaque(Attaque1)
    return (Attaque1);
}

function change_format_attaque(format_1) {
    // console.log(format_1);
    var format_2 = [];      // la nouvelle liste des attaques en format x-x-x-x


    for (let i = 0; i < format_1.length; i++) {

        for (let j = i + 1; j < format_1.length; j++) {                                  // boucle for pour prendre une deuxième attaque (j)

            if (format_1[i]["Vdef_X"] === format_1[j]["Vdef_X"] &&              // comparaison des deux attaques sur plusieurs paramètres
                format_1[i]["Vdef_Y"] === format_1[j]["Vdef_Y"] &&
                format_1[i]["Voff_X"] === format_1[j]["Voff_X"] &&
                format_1[i]["Voff_Y"] === format_1[j]["Voff_Y"]) {
                // console.log('same')
                // console.log(format_1[i]["time_path"])
                // console.log(format_1[j]["time_path"])
                // if (format_1[i]["time_impact"].getTime() === format_1[j]["time_impact"].getTime() - 1000 &&  //comparaison des deux attaques sur le temps : 
                // if (format_1[i]["time_impact"] === format_1[j]["time_impact"] - 1000 &&  //comparaison des deux attaques sur le temps : 
                if (format_1[i]["time_path"] === format_1[j]["time_path"] - 1 &&  //comparaison des deux attaques sur le temps : 
                    format_1[j]["time_path"] != false &&
                    format_1[i]["vague"] != false &&
                    format_1[j]["vague"] != false
                ) {
                    console.log('time ok')
                    format_1[i]["vague"] = format_1[i]["vague"] + "=" + format_1[j]["vague"]      //et le paramètre vague passe de x à x-y
                    format_1[i]["time_path"] = format_1[j]["time_path"]
                    format_1[j]["vague"] = false
                }

            }
        }
    }

    for (let i = 0; i < format_1.length; i++) {
        if (format_1[i]["vague"] != false) {

            if (format_1[i]["vague"].length > 1) {
                var nbr = (format_1[i]["vague"].length - 1) / 2
            } else { var nbr = 0 };

            // format_1[i]["time_impact"] = new Date(format_1[i]["time_impact"].getTime() - 1000 * nbr);
            format_1[i]["time_path"] = format_1[i]["time_path"] - 1 * nbr;

            format_2.push(format_1[i]);
        }
    }

    // console.log(format_2);
    return (format_2);
}


function clean_nom_de_village(nom) {
    // console.log(nom)
    let nom_clean = "";
    for (let i = 0; i < nom.length; i++) {

        var re23 = new RegExp('[\\[\\]\\(\\)\\?\\|\\{\\}\\^\\@\\#\\~\\&\\"\\*\\$\\+]')
        var tempre3 = nom[i].match(re23);
        // console.log("regexp : " + tempre3)
        if (tempre3 != null) {
            nom_clean += "\\" + nom[i];
        } else {
            nom_clean += nom[i];
        }
        // console.log(nom_clean)
    }
    // console.log(nom_clean)
    return (nom_clean)
}

export { saveAttacks, getAttacks, fetchAttacksDataDB, Parse_PR }