import React, { useEffect, useState } from 'react';
import './AnalyseVdef.css';
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
    saveSpy,
    saveMur
} from './functions_analyseVdef';
// import TestChart from './TestChart';

export default function AnalyseVdef() {

    const [attaquesByVdef, setAttaquesByVdef] = useState([]);
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
        attaques.forEach(att => temp.push(att.def))
        let dataOffV5 = []
        attaques.forEach(att => dataOffV5.push(att.off))
        // console.log(temp)
        temp = temp.filter((el, index) => temp.findIndex(e => e.X === el.X && e.Y === el.Y) === index)
        // console.log(temp)

        let defDataFrom5 = [];
        for (let k = 0; k < temp.length; k++) {
            try {
                let a = await CRUD_get("villages_5", temp[k]._id);
                if (a)
                    defDataFrom5.push(a);
            } catch (error) {
                console.log(error)
            }
        }

        let offDataFrom5 = [];
        dataOffV5 = dataOffV5.filter((el, index) => dataOffV5.findIndex(e => e._id === el._id) === index)
        for (let k = 0; k < dataOffV5.length; k++) {
            try {
                // if(defDataFrom5)
                let a = await CRUD_get("villages_5", dataOffV5[k]._id);
                if (a)
                    offDataFrom5.push(a);
            } catch (error) {
                console.log(error)
            }
        }

        defDataFrom5 = defDataFrom5.concat(temp)
        let towns = defDataFrom5.filter((el, index) => defDataFrom5.findIndex(e => e._id === el._id) === index)

        let goodArr = []
        towns.forEach(town => {
            let attTemp = []
            if (town.X) {
                attTemp = attaques.filter(att => { return (att.def.X === town.X && att.def.Y === town.Y) })
            } else if (town.X) {
                attTemp = attaques.filter(att => { return (att.def.X === town.X && att.def.Y === town.Y) })
            }
            attTemp.sort((a, b) => a.time.impact - b.time.impact)
            goodArr.push({
                village: town,
                attaques: attTemp
            })
        })
        goodArr.map(v => {
            v.attaques.map((att, i) => {
                // console.log(att)
                // console.log(dataOffV5)
                let voffTemp = offDataFrom5.find(v => v._id === att.off._id)
                let PTmin = voffTemp.PTmin ? voffTemp.PTmin : 0;
                let PTmax = voffTemp.PTmax ? voffTemp.PTmax : 20;
                // console.log(voffTemp)
                v.attaques[i] = { ...v.attaques[i], PTmin: PTmin, PTmax: PTmax }
            })
        })

        // console.log(goodArr)
        setAttaquesByVdef(goodArr);
    }

    function changeNumero(e) {

        if (e === -1) {
            if (numero > 0) {
                setNumero(numero - 1)
            } else {
                setNumero(attaquesByVdef.length - 1)
            }
        } else if (e === 1) {
            if (numero < attaquesByVdef.length - 1) {
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

    function addMur() {
        let attaque = attaquesByVdef[numero]
        console.log(attaque)
        saveMur(attaque)
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
                className="browser-default AVdef_select_resize"
                onChange={(e) => changeNumero(e.target.value)}
                value={numero}
            >
                {attaquesByVdef && attaquesByVdef.length > 0 && attaquesByVdef.map((el, index) => {
                    return (
                        <option key={index} value={index}>{'[' + el.village.An + '] ' + el.village.Un + ' ' + el.village.Vn + ' (' + el.village.X + '/' + el.village.Y + ')'}</option>
                    )
                })}
            </select>


            <div className='AVdef_top_wrap'>
                <button className='btn AVdef_btn_loc_left' onClick={() => changeNumero(-1)}>{"<<<"}</button>

                {attaquesByVdef && attaquesByVdef[numero] &&
                    <div className='AVdef_title_page'>{attaquesByVdef[numero].village.Vn + " (" + attaquesByVdef[numero].village.X + "/" + attaquesByVdef[numero].village.Y + ")"}</div>
                }

                <button className='btn AVdef_btn_loc_right' onClick={() => changeNumero(1)}>{">>>"}</button>
            </div>


            <table className='centered AVdef_table_1'>
                <thead>
                    <tr>
                        <th>Vivi attaqué</th>
                        <th>Joueur</th>
                        <th>Alliance</th>
                        <th>Pop</th>
                        <th>Rôle</th>
                        {/* <th>Pt (min/max)</th> */}
                        {/* {attaquesByVdef && attaquesByVdef[numero] &&
                            <th colSpan={0}>{
                                (attaquesByVdef[numero].village.T == 3 ? "Gau" : attaquesByVdef[numero].village.T == 2 ? "Ger" : "Rom")
                                + " (en k)"}
                            </th>} */}
                    </tr>
                </thead>

                <tbody>
                    {attaquesByVdef && attaquesByVdef[numero] &&
                        <tr>
                            <td>
                                <a className='AVdef_link_table'
                                    href={"https://ts1.x1.europe.travian.com/position_details.php?x=" + attaquesByVdef[numero].village.X + "&y=" + attaquesByVdef[numero].village.Y}
                                    target="_blank" rel="noreferrer">
                                    {attaquesByVdef[numero].village.Vn + " (" + attaquesByVdef[numero].village.X + '/' + attaquesByVdef[numero].village.Y + ')'}
                                </a>
                            </td>
                            <td>
                                <a className='AVdef_link_table'
                                    href={"https://ts1.x1.europe.travian.com/profile/" + attaquesByVdef[numero].village.Uid}
                                    target="_blank" rel="noreferrer">
                                    {attaquesByVdef[numero].village.Un}
                                </a>
                            </td>
                            <td>
                                <a className='AVdef_link_table'
                                    href={"https://ts1.x1.europe.travian.com/alliance/" + attaquesByVdef[numero].village.Aid}
                                    target="_blank" rel="noreferrer">
                                    {attaquesByVdef[numero].village.An}
                                </a>
                            </td>
                            <td>{attaquesByVdef[numero].village.Pop}</td>
                            <td>{attaquesByVdef[numero].village && attaquesByVdef[numero].village.role && attaquesByVdef[numero].village.role.join(', ')}</td>
                            {/* <td>
                                {attaquesByVdef[numero].village && attaquesByVdef[numero].village.PTmin &&
                                    (attaquesByVdef[numero].village.PTmin +
                                        " - " +
                                        attaquesByVdef[numero].village.PTmax)
                                }
                            </td> */}
                            {/* <td>{attaquesByVdef[numero].village.T}</td> */}
                            {/* <td> */}
                            {/* <table className='centered'> */}
                            {/* <thead>
                                        <tr>
                                            {attaquesByVdef[numero].village.T === "1" &&
                                                <>
                                                    <th>impé</th>
                                                    <th>toris</th>
                                                    <th>cae</th>
                                                </>
                                            }
                                            {attaquesByVdef[numero].village.T === "2" &&
                                                <>
                                                    <th>gg</th>
                                                    <th>h</th>
                                                    <th>teu</th>
                                                </>
                                            }
                                            {attaquesByVdef[numero].village.T === "3" &&
                                                <>
                                                    <th>ep</th>
                                                    <th>touta</th>
                                                    <th>hed</th>
                                                </>
                                            }
                                            <th>b</th>
                                            <th>cat</th>
                                        </tr>
                                    </thead> */}

                            {/* <tbody> */}
                            {/* <tr> */}
                            {/* {attaquesByVdef[numero].village.troops && attaquesByVdef[numero].village.troops.length > 0 && attaquesByVdef[numero].village.troops.map((t, index) => {
                                return (<td key={index}>{t}</td>)
                            })}
                            {(attaquesByVdef[numero].village.troops && attaquesByVdef[numero].village.troops.length == 0 || !attaquesByVdef[numero].village.troops) && Array(5).fill(0).map((t, index) => {
                                return (<td key={index}>{"?"}</td>)
                            })} */}
                            {/* </tr> */}
                            {/* </tbody> */}
                            {/* </table> */}
                            {/* </td> */}
                        </tr>
                    }
                </tbody>
            </table>

            <div className='AVdef_action_wrap'>
                {/* <p className='AVdef_action_title'>Actions</p> */}

                <div className='AVdef_action_icc_wrap'>


                    {/* BOUTTON SPY */}
                    {/* <div className='AVdef_draw_circle_def_spy_icc_block'
                        onClick={() => addSpy()}
                    >
                        <FontAwesomeIcon icon={faBinoculars}
                            className={true === true ? 'AVdef_draw_circle_def_spy_icc' : 'AVdef_draw_circle_def_spy_icc_ok'}
                        ></FontAwesomeIcon>
                        {true === true ?
                            <p className='AVdef_draw_circle_def_spy_info'>cliquer pour demander un spy</p>
                            :
                            <p className='AVdef_draw_circle_def_spy_info'>spy déjà demandé</p>
                        }
                    </div> */}


                    {/* BOUTTON MUR */}
                    <div className='AVdef_draw_circle_def_mur_icc_block'
                        onClick={() => addMur()}
                    >
                        <FontAwesomeIcon icon={faShield}
                            className={true === true ? 'AVdef_draw_circle_def_mur_icc' : 'AVdef_draw_circle_def_mur_icc_ok'}
                        ></FontAwesomeIcon>
                        {true === true ?
                            <p className='AVdef_draw_circle_def_mur_info'>cliquer pour ajouter un mur</p>
                            :
                            <p className='AVdef_draw_circle_def_mur_info'>mur déjà demandé</p>
                        }
                    </div>

                </div>

            </div>


            <table className='centered highlight AVdef_table_2'>
                <thead>
                    <tr>
                        <th>Vivi attaquant</th>
                        <th>Impact</th>
                        <th colSpan={"1"}>{"Départ"}</th>
                        {/* <th>Danger</th> */}
                        <th>Speed</th>
                        <th>Vagues</th>
                        <th>Troupes</th>
                    </tr>
                </thead>

                <tbody>
                    {attaquesByVdef && attaquesByVdef[numero] && attaquesByVdef[numero].attaques.map(
                        (attaque, index) => {
                            // console.log(attaquesByVdef[numero])
                            // console.log(attaque)
                            return (
                                <tr key={index}>
                                    {/* <td>{attaque.def.X + "/" + attaque.def.Y + " : " + attaque.def.Vn}</td> */}
                                    <td>
                                        <a className='AVdef_link_table'
                                            href={"https://ts1.x1.europe.travian.com/position_details.php?x=" + attaque.off.X + "&y=" + attaque.off.Y}
                                            target="_blank" rel="noreferrer">
                                            {attaque.off.Vn + ' (' + attaque.off.X + "/" + attaque.off.Y + ')'}
                                        </a>
                                    </td>
                                    <td>{(new Date(attaque.time.impact)).toLocaleString()}</td>
                                    {attaque.PTmin !== attaque.PTmax ?
                                        <>
                                            <td>{
                                                calcul_tps_trajet(attaque.PTmin, attaque.detail.speed, attaque) +
                                                ' - ' +
                                                calcul_tps_trajet(attaque.PTmax, attaque.detail.speed, attaque)
                                            }</td>
                                        </>
                                        :
                                        <td>{calcul_tps_trajet(attaque.PTmin, attaque.detail.speed, attaque)}</td>
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
