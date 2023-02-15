import React, { useEffect, useState } from 'react';
import './AnalyseTrajets.css';
import {
    tempsTrajet_bySpeed,
    CRUD_put,
    CRUD_getAll,
    CRUD_get,
    expliciteSecondes,
    distanceDeuxVivis,
    distanceDeuxPoints,
    allertMessage,
    tempsTrajet_byPt,
    saveVivi5,
    calcul_tps_depart
} from './functions_analyseTrajets';
import TestChart from './TestChart';

export default function AnalyseTrajets() {

    const [attaquesByVoff, setAttaquesByVoff] = useState([]);
    const [numero, setNumero] = useState(0);

    useEffect(() => {
        // console.clear()
        populateAttaques();
    }, [])

    async function populateAttaques() {
        const attaques = await CRUD_getAll("attaques");
        let aa = [];
        let temp = [];
        attaques.forEach(att => temp.push(att.off))
        // console.log(temp)
        temp = temp.filter((el, index) => temp.findIndex(e => e.X === el.X && e.Y === el.Y) === index)
        // console.log(temp)

        let dataFrom5 = [];
        for (let k = 0; k < temp.length; k++) {
            try {
                let a = await CRUD_get("villages_5", temp[k]._id);
                if (a)
                    dataFrom5.push(a);
            } catch (error) {
                console.log(error)
            }
        }

        dataFrom5 = dataFrom5.concat(temp)
        let towns = dataFrom5.filter((el, index) => dataFrom5.findIndex(e => e._id === el._id) === index)

        let goodArr = []
        towns.forEach(town => {
            let attTemp = []
            if (town.X) {
                attTemp = attaques.filter(att => { return (att.off.X === town.X && att.off.Y === town.Y) })
            } else if (town.X) {
                attTemp = attaques.filter(att => { return (att.off.X === town.X && att.off.Y === town.Y) })
            }
            goodArr.push({
                village: town,
                attaques: attTemp
            })
        })

        // console.log(goodArr)
        setAttaquesByVoff(goodArr);
    }

    const speedChoices = [3, 4, 5]
    const [speedSearched, setSpeedSearched] = useState(new Array(speedChoices.length).fill(false));


    function handleChange(e) {
        let temp = new Array(speedChoices.length).fill(false);
        temp[e] = !speedSearched[e];
        setSpeedSearched(temp);
    }

    function changeNumero(e) {

        if (e === -1) {
            if (numero > 0) {
                setNumero(numero - 1)
            } else {
                setNumero(attaquesByVoff.length - 1)
            }
        } else if (e === 1) {
            if (numero < attaquesByVoff.length - 1) {
                setNumero(numero + 1)
            } else {
                setNumero(0)
            }
        } else {
            setNumero(e);
        }
    }

    // useEffect(() => {
    //     console.log(speedSearched)
    // }, [speedSearched])

    const [tempsTrajet_byPt_data, setIt] = useState([])
    const [attToSave, setAttToSave] = useState([]);
    const [changesToSave, setChangesToSave] = useState(false)

    useEffect(() => {
        if (attaquesByVoff[numero]) {
            let ans = [];
            attaquesByVoff[numero].attaques.map(att => {
                ans.push(tempsTrajet_byPt(att.off, att.def, att.time.path, att.time.cleanTime))
            })
            setIt(ans)

            let min = "0";
            let max = "20";
            // console.log()
            if (attaquesByVoff[numero].village.PTmin)
                min = attaquesByVoff[numero].village.PTmin
            if (attaquesByVoff[numero].village.PTmax)
                max = attaquesByVoff[numero].village.PTmax

            setLvlPt([min, max]);
        }
        // setAttToSave([]);
        // setChangesToSave(false);

    }, [numero, attaquesByVoff])

    useEffect(() => {

        setAttToSave([]);
        setChangesToSave(false);

    }, [numero])

    // useEffect(() => {
    //     console.log(tempsTrajet_byPt_data)
    // }, [tempsTrajet_byPt_data])

    const [lvlPt, setLvlPt] = useState(["0", "20"]);
    function handleChangeLvlPt(e, i) {
        setChangesToSave(true)
        let temp = [].concat(lvlPt);
        if (e <= 20 && e >= 0 && ((i === 0 && parseInt(e) <= parseInt(lvlPt[1])) || (i === 1 && parseInt(e) >= parseInt(lvlPt[0])))) {
            temp[i] = e;
        }
        setLvlPt(temp);
    }

    // useEffect(() => {
    //     console.log(lvlPt)
    // }, [lvlPt])
    // const [villages_5_data, setVivi5] = useState([]);



    function handleSave() {
        console.log(attaquesByVoff)
        console.log("saves lvl pt");
        let viviToSave = { ...attaquesByVoff[numero].village, PTmin: lvlPt[0], PTmax: lvlPt[1] }
        saveVivi5([viviToSave]);

        let temp = [].concat(attaquesByVoff);
        temp[numero].village.PTmin = lvlPt[0]
        temp[numero].village.PTmax = lvlPt[1]
        setAttaquesByVoff(temp);

        let temp2 = attToSave;
        // console.log(temp2)
        temp2 = attToSave.filter((el, index) => index === attToSave.findIndex(e => e === el));
        // console.log(temp2)
        temp2.forEach(attID => CRUD_put("attaques", attaquesByVoff[numero].attaques.find(el => el.id === attID)))
        setAttToSave([]);
        setChangesToSave(false)
        //save to speed

    }

    function changeSpeedAttaque(value, attaque) {
        setChangesToSave(true)
        // console.log(value, attaque)

        let temp = attaquesByVoff;
        // console.log(temp[numero])
        temp[numero] = {
            ...temp[numero], attaques: temp[numero].attaques.map(att => {
                // console.log(att)
                if (att.id !== attaque.id) {
                    return att
                } else {
                    // console.log(att)
                    // console.log({ ...att, speed: value })
                    setAttToSave([...attToSave, att.id])
                    return { ...att, detail: { ...att.detail, speed: parseInt(value) } }
                }
            })
        }
        let a = [].concat(temp)
        setAttaquesByVoff(a);

    }

    // useEffect(() => {
    //     // if (attaquesByVoff[numero] && attaquesByVoff[numero].attaques.length > 0)
    //     //     console.log(attaquesByVoff[numero].attaques)
    //     // console.log(attToSave)
    //     console.log(attaquesByVoff)
    // }, [attaquesByVoff, numero])

    return (
        <>
            <button
                className={changesToSave ? 'btn orange darken-1' : 'btn blue accent-3'}
                onClick={() => handleSave()}
                disabled={!changesToSave}
            >Save changes</button>

            <div className='analyse_trajet_top_wrap'>

                <button className='btn btn_loc_left' onClick={() => changeNumero(-1)}>{"<<<"}</button>

                {attaquesByVoff && attaquesByVoff[numero] &&
                    <div className='title_page'>{"Analyse PT : " + attaquesByVoff[numero].village.Vn + " (" + attaquesByVoff[numero].village.X + "/" + attaquesByVoff[numero].village.Y + ")"}</div>
                }

                <button className='btn btn_loc_right' onClick={() => changeNumero(1)}>{">>>"}</button>
            </div>

            <select
                name="player"
                id="player-select"
                className="browser-default analyse_select_resize"
                onChange={(e) => changeNumero(e.target.value)}
                // defaultValue={"0"}
                value={numero}
            >
                {/* <option value="" disabled>--Voff--</option> */}
                {attaquesByVoff && attaquesByVoff.length > 0 && attaquesByVoff.map((el, index) => {
                    // console.log(el)
                    return (
                        <option key={index} value={index}>{'[' + el.village.An + '] ' + el.village.Un + ' ' + el.village.Vn + ' (' + el.village.X + '/' + el.village.Y + ')'}</option>
                    )
                })}
            </select>

            <div className='speedChoices_wrap'>

                {speedChoices.map((speed, index) => {
                    return (
                        <div key={index}>
                            <label className='testaaz'>
                                <input
                                    type="checkbox"
                                    value={index}
                                    checked={speedSearched[index]}
                                    onChange={() => handleChange(index)}
                                /><span className='aaz'>{"vitesse : " + speedChoices[index]}</span>
                            </label>
                        </div>
                    );
                })}

            </div>

            {
                tempsTrajet_byPt_data && (speedSearched[0] || speedSearched[1] || speedSearched[2]) &&
                <div className='chart_wrap'>
                    <div className='chart_wrap2'>
                        <TestChart attaques={tempsTrajet_byPt_data} speed={speedSearched} />
                    </div>

                    <div className='wrap_input'>
                        <div className="input-field">
                            <span>Pt min : </span>
                            <input
                                max={20}
                                min={0}
                                type="number"
                                value={lvlPt[0]}
                                onChange={(e) => handleChangeLvlPt(e.target.value, 0)} className='browser-default'
                                id='ptMin'
                            ></input>
                            {/* <label htmlFor="ptMin">pt min</label> */}
                        </div>

                        <div className="input-field">
                            <span>Pt min : </span>
                            <input
                                max={20}
                                min={0}
                                type="number"
                                value={lvlPt[1]}
                                onChange={(e) => handleChangeLvlPt(e.target.value, 1)}
                                // className='btn_z'
                                className='browser-default'
                                id='ptMax'
                            ></input>
                            {/* <label htmlFor="ptMax">pt max</label> */}
                        </div>
                    </div>

                </div>
            }


            <table className='centered'>
                <thead>
                    <tr>
                        <th>Vivi attaquant</th>
                        <th>Player</th>
                        <th>Alliance</th>
                        <th>Pop</th>
                        <th>Rôle</th>
                        <th>Pt (min/max)</th>
                    </tr>
                </thead>

                <tbody>
                    {attaquesByVoff && attaquesByVoff[numero] && attaquesByVoff[numero] &&
                        <tr>
                            <td>
                                <a className='link_table'
                                    href={"https://ts1.x1.europe.travian.com/position_details.php?x=" + attaquesByVoff[numero].village.X + "&y=" + attaquesByVoff[numero].village.Y}
                                    target="_blank">
                                    {attaquesByVoff[numero].village.X + "/" + attaquesByVoff[numero].village.Y + ' " ' + attaquesByVoff[numero].village.Vn + ' "'}
                                </a>
                            </td>
                            <td>
                                <a className='link_table'
                                    href={"https://ts1.x1.europe.travian.com/profile/" + attaquesByVoff[numero].village.Uid}
                                    target="_blank">
                                    {attaquesByVoff[numero].village.Un}
                                </a>
                            </td>
                            <td>
                                <a className='link_table'
                                    href={"https://ts1.x1.europe.travian.com/alliance/" + attaquesByVoff[numero].village.Aid}
                                    target="_blank">
                                    {attaquesByVoff[numero].village.An}
                                </a>
                            </td>
                            <td>{attaquesByVoff[numero].village.Pop}</td>
                            <td>{attaquesByVoff[numero].village && attaquesByVoff[numero].village.role && attaquesByVoff[numero].village.role.join(',')}</td>
                            {/* <td>
                                {attaquesByVoff[numero].village && attaquesByVoff[numero].village.PTmin &&
                                    (attaquesByVoff[numero].village.PTmin +
                                        " - " +
                                        attaquesByVoff[numero].village.PTmax)
                                }
                            </td> */}
                            <td className='' >
                                {/* <div> */}
                                {/* <div className=" col s4 "> */}
                                {/* <span>Pt min : </span> */}
                                <input
                                    max={20}
                                    min={0}
                                    type="number"
                                    value={lvlPt[0]}
                                    onChange={(e) => handleChangeLvlPt(e.target.value, 0)}
                                    className='browser-default'
                                    id='ptMin'
                                ></input>
                                {/* <label htmlFor="ptMin">pt min</label> */}
                                {/* </div> */}

                                {/* <div className=" col s4"> */}
                                {/* <span>Pt min : </span> */}
                                <input
                                    max={20}
                                    min={0}
                                    type="number"
                                    value={lvlPt[1]}
                                    onChange={(e) => handleChangeLvlPt(e.target.value, 1)}
                                    className='browser-default'
                                    id='ptMax'
                                ></input>
                                {/* <label htmlFor="ptMax">pt max</label> */}
                                {/* </div> */}
                                {/* </div>  */}


                            </td>
                        </tr>
                    }
                </tbody>

            </table>


            <table className='centered'>
                <thead>
                    <tr>
                        {/* <th>Vivi attaquant</th> */}
                        <th>Vivi cible</th>
                        <th>Impact</th>
                        <th>Distance</th>
                        <th colSpan="2">{"Fourchette départ"}</th>
                        {/* <th>{"Trajet (restant => min)"}</th> */}
                        <th>Pt</th>
                        <th colSpan="2">Départ min/max</th>
                        {/* <th>Départ max</th> */}
                        <th>Danger</th>
                        <th>Vitesse</th>
                        <th>Vagues</th>
                        <th>Troupes</th>
                    </tr>
                </thead>


                <tbody>
                    {attaquesByVoff && attaquesByVoff[numero] && attaquesByVoff[numero].attaques.map(
                        (attaque, index) => {
                            // console.log(attaque)
                            // console.log("===================")
                            // if (index <= 0)
                            return (
                                <tr key={index}>
                                    {/* <td>{attaque.off.X + "/" + attaque.off.Y}</td> */}
                                    <td>{attaque.def.X + "/" + attaque.def.Y + " : " + attaque.def.Vn}</td>
                                    {/* <td>{attaque.time.impact}</td> */}
                                    {/* <td>{(new Date(Math.floor(attaque.time.impact))).toLocaleString()}</td> */}
                                    <td>{(new Date(attaque.time.impact)).toLocaleString()}</td>
                                    <td>{Math.floor(distanceDeuxPoints(attaque.off, attaque.def) * 10) / 10}</td>
                                    {/* <td>{expliciteSecondes(attaque.time.path)}</td> */}
                                    {/* <td>{expliciteSecondes(attaque.time.cleanTime)}</td> */}
                                    {/* <td>{(new Date(attaque.time.impact - attaque.time.path * 1000)).toLocaleTimeString()}</td>
                                    <td>{(new Date(attaque.time.impact - attaque.time.cleanTime * 1000)).toLocaleTimeString()}</td> */}
                                    <td>{
                                        (new Date(attaque.time.impact - attaque.time.cleanTime * 1000)).getDate() === (new Date(attaque.time.impact)).getDate() ?
                                            (new Date(attaque.time.impact - attaque.time.cleanTime * 1000)).toLocaleTimeString()
                                            :
                                            (new Date(attaque.time.impact - attaque.time.cleanTime * 1000)).toLocaleString()
                                    }</td>
                                    <td>{
                                        (new Date(attaque.time.impact - attaque.time.path * 1000)).getDate() === (new Date(attaque.time.impact)).getDate() ?
                                            (new Date(attaque.time.impact - attaque.time.path * 1000)).toLocaleTimeString()
                                            :
                                            (new Date(attaque.time.impact - attaque.time.path * 1000)).toLocaleString()
                                    }</td>
                                    {/* <td>
                                        {tempsTrajet_byPt(attaque.off, attaque.def, attaque.time.path, attaque.time.cleanTime).map((pt, index1) => {
                                            // console.log(pt.speed, index1)
                                            // console.log(pt, index1)
                                            if (pt.speed.includes(3) && speedSearched[0]) {
                                                // console.log("all 3 ok")
                                                return (
                                                    <span className='test_police1' key={index1}>{pt.pt + ","}</span>
                                                )
                                            } else if (pt.speed.includes(4) && speedSearched[1]) {
                                                return (
                                                    <span className='test_police2' key={index1}>{pt.pt + ","}</span>
                                                )
                                            } else if (pt.speed.includes(5) && speedSearched[2]) {
                                                return (
                                                    <span className='test_police3' key={index1}>{pt.pt + ","}</span>
                                                )
                                            } else {
                                                return (
                                                    <span className='test_police3' key={index1}>{"."}</span>
                                                )
                                            }
                                        })
                                        }
                                    </td> */}
                                    <td>
                                        {tempsTrajet_bySpeed(attaque.off, attaque.def, attaque.time.path, attaque.time.cleanTime).map((pt, index1) => {
                                            // console.log(pt)
                                            if (pt.speed === 3) { //&& speedSearched[0]
                                                // console.log("all 3 ok")
                                                return (
                                                    <span className='test_police1' key={index1} >{pt.pt.join(',') + ' '}</span>//"speed " + pt.speed + " : " +
                                                )
                                            } else if (pt.speed === 4) { // && speedSearched[1]
                                                return (<span className='test_police2' key={index1}  >{' ' + pt.pt.join(',') + ' '}</span>//"speed " + pt.speed + " : " +
                                                )
                                            } else if (pt.speed === 5) { //&& speedSearched[2]
                                                return (<span className='test_police3' key={index1}  >{' ' + pt.pt.join(',') + ' '}</span>//"speed " + pt.speed + " : " +
                                                )
                                            } else {
                                                return (
                                                    <span className='test_police3' key={index1}>{"autre"}</span>
                                                )
                                            }

                                        })
                                        }
                                    </td>
                                    {/* <td>{index === 0 && calcul_tps_depart(lvlPt[0], speedSearched, speedChoices, attaque)}</td> */}
                                    {/* <td>{calcul_tps_depart(lvlPt[0], speedSearched, speedChoices, attaque)}</td> */}
                                    {/* <td>{calcul_tps_depart(lvlPt[1], speedSearched, speedChoices, attaque)}</td> */}
                                    {/* {index === 0 && <td>{calcul_tps_depart(lvlPt[0], attaque.detail.speed, speedChoices, attaque)}</td>} */}
                                    {/* {index === 0 && <td>{calcul_tps_depart(lvlPt[1], attaque.detail.speed, speedChoices, attaque)}</td>} */}
                                    {<td>{calcul_tps_depart(lvlPt[0], attaque.detail.speed, speedChoices, attaque)}</td>}
                                    {<td>{calcul_tps_depart(lvlPt[1], attaque.detail.speed, speedChoices, attaque)}</td>}
                                    {/* <td>{calcul_tps_depart(lvlPt[1],)}</td> */}
                                    <td>{allertMessage(tempsTrajet_byPt(attaque.off, attaque.def, attaque.time.path, attaque.time.cleanTime))}</td>
                                    <td>
                                        <select
                                            name="speed"
                                            id="attaque-speed"
                                            className="browser-default speed_select_resize"
                                            // onChange={(e) => changeSpeedAttaque(e.target.value)}
                                            onChange={(e) => changeSpeedAttaque(e.target.value, attaque)}
                                            // defaultValue={"0"}
                                            value={(attaque.detail && attaque.detail.speed) ? attaque.detail.speed : 0}
                                        >
                                            <option value={0}>?</option>
                                            {speedChoices.map((speed, index) => {
                                                // console.log(el)
                                                return (
                                                    <option key={index} value={speed}>{speed}</option>
                                                )
                                            })}
                                        </select>
                                    </td>
                                    <td>{attaque.detail.vague}</td>
                                    <td>{attaque.detail.troupes}</td>
                                </tr>
                            )
                        })}
                </tbody>
            </table>


        </>
    )
}
