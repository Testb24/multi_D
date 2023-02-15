import React, { useState, useEffect } from 'react';
import { CRUD_get } from '../functionsGestionMur';


import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../config/functionFB";
import { query, collection, getDocs, where, onSnapshot, doc } from "firebase/firestore";

import { onAuthStateChanged, getAuth } from "firebase/auth";
import Total from "./Total"
import Form from "./Form"
import Recap from "./Recap"

import "./PageMur.css"

export default function PageMur({ mur, user, setMur }) {

    console.log(mur)
    const ref = collection(db, "mur");

    const [needNewData, setNeedNewData] = useState(false)

    // useEffect(() => {

    //     const time = 0.1 * 60;

    //     const startFunction = setTimeout(() => {
    //         setNeedNewData(true)
    //     }, time * 1000)

    //     return () => {
    //         clearTimeout(startFunction)
    //     }
    // }, [])

    async function loadFreshData() {
        const newDataMur = await CRUD_get(mur.id);
        setMur(newDataMur);
        setNeedNewData(false);
        const time = 0.1 * 60;

        const startFunction = setTimeout(() => {
            setNeedNewData(true)
        }, time * 1000)
        return () => {
            clearTimeout(startFunction)
        }
    }

    return (
        <div>
            {mur && user &&
                <>
                    <div className='btn_reload_wrap'>
                        {needNewData && <button
                            onClick={loadFreshData}
                            className='btn  z-depth-1 btn_reload'>Rechargement des données</button>}
                        {/* green accent-4 */}
                    </div>

                    <table className='table_top'>
                        <tbody>
                            <tr>
                                <th>Mur : {mur.id}</th>
                                {/* <th>Impact : {mur.firstImpact}</th> */}
                                <th>Impact : {(new Date(mur.firstImpact)).toLocaleString()}</th>
                                <th>Objectif : {mur.troupesObj}</th>
                                <th>Remplissage : {Math.round(mur.remplissage * 1000) / 10 + '%'}</th>
                                {/* <th>Attaqué : {mur.id}</th> */}
                            </tr>
                        </tbody>
                    </table>
                    <table className='table_top'>
                        <tbody>
                            <tr>
                                <th><a className='top_link'
                                    href={"https://www.gettertools.com/ts1.x1.europe.travian.com.3/def-table/" + mur.firstImpact / 1000 + "/" + mur.def.X + "," + mur.def.Y}
                                    target="_blank">Table Getter
                                </a></th>
                                <th><a className='top_link'
                                    href={"https://ts1.x1.europe.travian.com/position_details.php?x=" + mur.def.X + "&y=" + mur.def.Y}
                                    target="_blank">Lien village
                                </a></th>
                            </tr>
                        </tbody>
                    </table>
                    <Total mur={mur} />
                    <br />
                    <br />
                    {/* <Form mur={mur} user={user} setMur={setMur} />
                    <br />
                    <br />
                    <Recap mur={mur} user={user} setMur={setMur} /> */}

                    <table className='table_form_recap'>
                        <thead>
                            <tr>
                                <th>Pseudo</th>
                                <th>Compte</th>
                                <th>Phalanges</th>
                                <th>Druides</th>
                                <th>Hédouins</th>
                                <th>Légionnaires</th>
                                <th>Prétoriens</th>
                                <th>Caesaris</th>
                                <th>Lances</th>
                                <th>Paladins</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <Form mur={mur} user={user} setMur={setMur} />
                            <Recap mur={mur} user={user} setMur={setMur} />
                        </tbody>
                    </table>
                </>
            }
        </div >
    )
}
