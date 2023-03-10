import React, { useEffect, useState } from 'react';
import './AnalyseVoff.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faBinoculars, faShield, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import img_gaul from "../../../assets/troops/gaul.png";
import img_roman from "../../../assets/troops/roman.png";
import img_teuton from "../../../assets/troops/teuton.png";
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
// import M from 'materialize-css';
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
            // console.log()
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

    // useEffect(() => {
    //     console.log(lvlPt)
    // }, [lvlPt])
    // const [villages_5_data, setVivi5] = useState([]);

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

            <div className='AVoff_profil_info'>
                <p className='AVoff_profil_info_titre'>Infos sur le profil</p>
            </div>

            <table className='centered AVoff_table_1'>
                <thead>
                    <tr>
                        <th>Vivi attaquant</th>
                        <th>Player</th>
                        <th>Alliance</th>
                        <th>Pop</th>
                        <th>R??le</th>
                        <th>Pt (min/max)</th>
                        {/* {attaquesByVoff && attaquesByVoff[numero] &&
                            <th colSpan={0}>{
                                (attaquesByVoff[numero].village.T == 3 ? "Gau" : attaquesByVoff[numero].village.T == 2 ? "Ger" : "Rom")
                                + " (en k)"}
                            </th>} */}
                        {attaquesByVoff && attaquesByVoff[numero] && attaquesByVoff[numero].village && attaquesByVoff[numero].village.T === "3" &&
                            <>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_gaul + ")",
                                            backgroundPosition: "-19px 0",
                                            // border:"1px solid white"
                                            margin: "auto"
                                        }}
                                    />
                                </th>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_gaul + ")",
                                            backgroundPosition: "-57px 0",
                                            margin: "auto"
                                        }}
                                    />
                                </th>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_gaul + ")",
                                            backgroundPosition: "-95px 0",
                                            margin: "auto"
                                        }}
                                    />
                                </th>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_gaul + ")",
                                            backgroundPosition: "-114px 0",
                                            margin: "auto"
                                        }}
                                    />
                                </th>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_gaul + ")",
                                            backgroundPosition: "-133px 0",
                                            margin: "auto"
                                        }}
                                    />
                                </th>

                            </>
                        }
                        {attaquesByVoff && attaquesByVoff[numero] && attaquesByVoff[numero].village && attaquesByVoff[numero].village.T === "2" &&
                            <>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_teuton + ")",
                                            backgroundPosition: "0px 0",
                                            // border:"1px solid white"
                                            margin: "auto"
                                        }}
                                    />
                                </th>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_teuton + ")",
                                            backgroundPosition: "-37px 0",
                                            margin: "auto"
                                        }}
                                    />
                                </th>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_teuton + ")",
                                            backgroundPosition: "-95px 0",
                                            margin: "auto"
                                        }}
                                    />
                                </th>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_teuton + ")",
                                            backgroundPosition: "-114px 0",
                                            margin: "auto"
                                        }}
                                    />
                                </th>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_teuton + ")",
                                            backgroundPosition: "-133px 0",
                                            margin: "auto"
                                        }}
                                    />
                                </th>

                            </>
                        }
                        {attaquesByVoff && attaquesByVoff[numero] && attaquesByVoff[numero].village && attaquesByVoff[numero].village.T === "1" &&
                            <>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_roman + ")",
                                            backgroundPosition: "-38px 0",
                                            // border:"1px solid white"
                                            margin: "auto"
                                        }}
                                    />
                                </th>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_roman + ")",
                                            backgroundPosition: "-76px 0",
                                            margin: "auto"
                                        }}
                                    />
                                </th>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_roman + ")",
                                            backgroundPosition: "-95px 0",
                                            margin: "auto"
                                        }}
                                    />
                                </th>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_roman + ")",
                                            backgroundPosition: "-114px 0",
                                            margin: "auto"
                                        }}
                                    />
                                </th>
                                <th className='AVdef_table_troops'>
                                    <div
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            backgroundImage: "url(" + img_roman + ")",
                                            backgroundPosition: "-133px 0",
                                            margin: "auto"
                                        }}
                                    />
                                </th>

                            </>
                        }

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

                            {attaquesByVoff[numero].village.troops && attaquesByVoff[numero].village.troops.length > 0 && attaquesByVoff[numero].village.troops.map((t, index) => {
                                if (t != 0) {
                                    return (<td key={index}>{t * 1000}</td>)
                                } else {
                                    return (<td key={index}>{" "}</td>)
                                }

                            })}

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
                            <p className='AVoff_draw_circle_def_spy_info'>spy d??j?? demand??</p>
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
                            <p className='AVoff_draw_circle_def_mur_info'>mur d??j?? demand??</p>
                        }
                    </div> */}

                </div>

            </div>


            <table className='centered highlight AVoff_table_2'>
                <thead>
                    <tr>
                        <th>Vivi attaqu??</th>
                        <th>Impact</th>
                        <th colSpan={lvlPt[0] !== lvlPt[1] ? "2" : "1"}>{lvlPt[0] !== lvlPt[1] ? "D??part min/max" : "D??part"}</th>
                        {/* <th>Danger</th> */}
                        <th>Speed</th>
                        <th>Vagues</th>
                        <th>Troupes</th>
                    </tr>
                </thead>

                <tbody>
                    {attaquesByVoff && attaquesByVoff[numero] && attaquesByVoff[numero].attaques.map(
                        (attaque, index) => {
                            // console.log(attaquesByVoff[numero])
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
