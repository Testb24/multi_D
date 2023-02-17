import React, { useEffect, useState } from 'react';
import './AnalyseVoff.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faBinoculars, faShield, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import {
    CRUD_getAll, CRUD_get,
    expliciteSecondes,
    distanceDeuxVivis,
    distanceDeuxPoints,
    allertMessage,
    tempsTrajet_byPt,
    saveVivi5,
    calcul_tps_trajet,
    saveSpy
} from './functions_analyseVoff';
// import TestChart from './TestChart';

export default function AnalyseVoff() {

    const [attaquesByVoff, setAttaquesByVoff] = useState([]);
    const [numero, setNumero] = useState(0);
    // const [changesToSave, setChangesToSave] = useState(false)

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

    useEffect(() => {
        if (attaquesByVoff[numero]) {
            let ans = [];
            attaquesByVoff[numero].attaques.map(att => {
                ans.push(tempsTrajet_byPt(att.off, att.def, att.time.path, att.time.cleanTime))
            })
            setIt(ans)

            let min = "0";
            let max = "20";
            console.log()
            if (attaquesByVoff[numero].village.PTmin)
                min = attaquesByVoff[numero].village.PTmin
            if (attaquesByVoff[numero].village.PTmax)
                max = attaquesByVoff[numero].village.PTmax

            setLvlPt([min, max]);
        }
    }, [numero, attaquesByVoff])

    // useEffect(() => {
    //     console.log(tempsTrajet_byPt_data)
    // }, [tempsTrajet_byPt_data])

    const [lvlPt, setLvlPt] = useState(["0", "20"]);

    function handleChangeLvlPt(e, i) {
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
    }

    function addSpy() {
        let attaque = attaquesByVoff[numero].attaques[0]
        // console.log(attaque)
        saveSpy(attaque)
    }

    return (
        <>
            {/* <button
                className={changesToSave ? 'btn orange darken-1' : 'btn blue accent-3'}
                onClick={() => handleSave()}
                disabled={!changesToSave}
            >Save changes</button> */}

            <select
                name="player"
                id="player-select"
                className="browser-default AVoff_select_resize"
                onChange={(e) => changeNumero(e.target.value)}
                value={numero}
            >
                {attaquesByVoff && attaquesByVoff.length > 0 && attaquesByVoff.map((el, index) => {
                    return (
                        <option key={index} value={index}>{'[' + el.village.An + '] ' + el.village.Un + ' ' + el.village.Vn + ' (' + el.village.X + '/' + el.village.Y + ')'}</option>
                    )
                })}
            </select>


            <div className='AVoff_top_wrap'>
                <button className='btn AVoff_btn_loc_left' onClick={() => changeNumero(-1)}>{"<<<"}</button>

                {attaquesByVoff && attaquesByVoff[numero] &&
                    <div className='AVoff_title_page'>{attaquesByVoff[numero].village.Vn + " (" + attaquesByVoff[numero].village.X + "/" + attaquesByVoff[numero].village.Y + ")"}</div>
                }

                <button className='btn AVoff_btn_loc_right' onClick={() => changeNumero(1)}>{">>>"}</button>
            </div>


            <table className='centered AVoff_table_1'>
                <thead>
                    <tr>
                        <th>Vivi attaquant</th>
                        <th>Player</th>
                        <th>Alliance</th>
                        <th>Pop</th>
                        <th>Rôle</th>
                        <th>Pt (min/max)</th>
                        {attaquesByVoff && attaquesByVoff[numero] &&
                            <th colSpan={0}>{
                                (attaquesByVoff[numero].village.T == 3 ? "Gau" : attaquesByVoff[numero].village.T == 2 ? "Ger" : "Rom")
                                + " (en k)"}
                            </th>}
                    </tr>
                </thead>

                <tbody>
                    {attaquesByVoff && attaquesByVoff[numero] &&
                        <tr>
                            <td>
                                <a className='AVoff_link_table'
                                    href={"https://ts1.x1.europe.travian.com/position_details.php?x=" + attaquesByVoff[numero].village.X + "&y=" + attaquesByVoff[numero].village.Y}
                                    target="_blank" rel="noreferrer">
                                    {attaquesByVoff[numero].village.Vn + " (" + attaquesByVoff[numero].village.X + '/' + attaquesByVoff[numero].village.Y + ')'}
                                </a>
                            </td>
                            <td>
                                <a className='AVoff_link_table'
                                    href={"https://ts1.x1.europe.travian.com/profile/" + attaquesByVoff[numero].village.Uid}
                                    target="_blank" rel="noreferrer">
                                    {attaquesByVoff[numero].village.Un}
                                </a>
                            </td>
                            <td>
                                <a className='AVoff_link_table'
                                    href={"https://ts1.x1.europe.travian.com/alliance/" + attaquesByVoff[numero].village.Aid}
                                    target="_blank" rel="noreferrer">
                                    {attaquesByVoff[numero].village.An}
                                </a>
                            </td>
                            <td>{attaquesByVoff[numero].village.Pop}</td>
                            <td>{attaquesByVoff[numero].village && attaquesByVoff[numero].village.role && attaquesByVoff[numero].village.role.join(', ')}</td>
                            <td>
                                {attaquesByVoff[numero].village && attaquesByVoff[numero].village.PTmin &&
                                    (attaquesByVoff[numero].village.PTmin +
                                        " - " +
                                        attaquesByVoff[numero].village.PTmax)
                                }
                            </td>
                            {/* <td>{attaquesByVoff[numero].village.T}</td> */}
                            <td>
                                <table className='centered'>
                                    <thead>
                                        <tr>
                                            {attaquesByVoff[numero].village.T === "1" &&
                                                <>
                                                    <th>impé</th>
                                                    <th>toris</th>
                                                    <th>cae</th>
                                                </>
                                            }
                                            {attaquesByVoff[numero].village.T === "2" &&
                                                <>
                                                    <th>gg</th>
                                                    <th>h</th>
                                                    <th>teu</th>
                                                </>
                                            }
                                            {attaquesByVoff[numero].village.T === "3" &&
                                                <>
                                                    <th>ep</th>
                                                    <th>touta</th>
                                                    <th>hed</th>
                                                </>
                                            }
                                            <th>b</th>
                                            <th>cat</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            {attaquesByVoff[numero].village.troops && attaquesByVoff[numero].village.troops.length > 0 && attaquesByVoff[numero].village.troops.map((t, index) => {
                                                return (<td key={index}>{t}</td>)
                                            })}
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>

            <div className='AVoff_action_wrap'>
                {/* <p className='AVoff_action_title'>Actions</p> */}

                <div className='AVoff_action_icc_wrap'>


                    {/* BOUTTON SPY */}
                    <div className='AVoff_draw_circle_def_spy_icc_block'
                        onClick={() => addSpy()}
                    >
                        <FontAwesomeIcon icon={faBinoculars}
                            className={true === true ? 'AVoff_draw_circle_def_spy_icc' : 'AVoff_draw_circle_def_spy_icc_ok'}
                        ></FontAwesomeIcon>
                        {true === true ?
                            <p className='AVoff_draw_circle_def_spy_info'>cliquer pour demander un spy</p>
                            :
                            <p className='AVoff_draw_circle_def_spy_info'>spy déjà demandé</p>
                        }
                    </div>


                    {/* BOUTTON MUR
                    <div className='AVoff_draw_circle_def_mur_icc_block'
                    // onClick={() => addMur(village)}
                    >
                        <FontAwesomeIcon icon={faShield}
                            className={true === true ? 'AVoff_draw_circle_def_mur_icc' : 'AVoff_draw_circle_def_mur_icc_ok'}
                        ></FontAwesomeIcon>
                        {true === true ?
                            <p className='AVoff_draw_circle_def_mur_info'>cliquer pour ajouter un mur</p>
                            :
                            <p className='AVoff_draw_circle_def_mur_info'>mur déjà demandé</p>
                        }
                    </div> */}

                </div>

            </div>


            <table className='centered highlight AVoff_table_2'>
                <thead>
                    <tr>
                        <th>Vivi attaqué</th>
                        <th>Impact</th>
                        <th colSpan={lvlPt[0] !== lvlPt[1] ? "2" : "1"}>{lvlPt[0] !== lvlPt[1] ? "Départ min/max" : "Départ"}</th>
                        {/* <th>Danger</th> */}
                        <th>Speed</th>
                        <th>Vagues</th>
                        <th>Troupes</th>
                    </tr>
                </thead>

                <tbody>
                    {attaquesByVoff && attaquesByVoff[numero] && attaquesByVoff[numero].attaques.map(
                        (attaque, index) => {
                            console.log(attaquesByVoff[numero])
                            // console.log(attaque)
                            return (
                                <tr key={index}>
                                    {/* <td>{attaque.def.X + "/" + attaque.def.Y + " : " + attaque.def.Vn}</td> */}
                                    <td>
                                        <a className='AVoff_link_table'
                                            href={"https://ts1.x1.europe.travian.com/position_details.php?x=" + attaque.def.X + "&y=" + attaque.def.Y}
                                            target="_blank" rel="noreferrer">
                                            {attaque.def.Vn + ' (' + attaque.def.X + "/" + attaque.def.Y + ')'}
                                        </a>
                                    </td>
                                    <td>{(new Date(attaque.time.impact)).toLocaleString()}</td>
                                    {lvlPt[0] !== lvlPt[1] ?
                                        <>
                                            <td>{calcul_tps_trajet(lvlPt[0], attaque.detail.speed, attaque)}</td>
                                            <td>{calcul_tps_trajet(lvlPt[1], attaque.detail.speed, attaque)}</td>
                                        </>
                                        :
                                        <td>{calcul_tps_trajet(lvlPt[0], attaque.detail.speed, attaque)}</td>
                                    }
                                    {/* <td>{allertMessage(tempsTrajet_byPt(attaque.off, attaque.def, attaque.time.path, attaque.time.cleanTime))}</td> */}
                                    <td>{attaque.detail.speed ? attaque.detail.speed : '?'}</td>
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
