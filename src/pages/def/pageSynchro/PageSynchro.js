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

export default function PageSynchro({ synchro, user, setSynchro }) {

    // console.log(synchro)

    const ref = collection(db, "synchro");

    const [needNewData, setNeedNewData] = useState(false)


    async function loadFreshData() {
        const newDataSynchro = await CRUD_get("synchro", synchro.id);
        setSynchro(newDataSynchro);
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
            {synchro && user &&
                <>
                    <div className='btn_reload_wrap'>
                        {needNewData && <button
                            onClick={loadFreshData}
                            className='btn  z-depth-1 btn_reload'>Rechargement des données</button>}
                    </div>

                    <table>
                        <tbody>
                            <tr>
                                <th>Synchro : {synchro.id}</th>
                                {/* <th>Impact : {synchro.impact}</th> */}
                                <th>Impact : {(new Date(synchro.impact)).toLocaleString()}</th>
                                <th>Attaqué : {synchro.def.X + '/' + synchro.def.Y}</th>
                            </tr>
                        </tbody>
                    </table>
                </>
            }
        </div>
    )
}
