import React, { useEffect, useState } from 'react';
import { CRUD_getAll, cleanIntervalle } from './AnalyseProfil_functions.js'
import M from 'materialize-css';
import "./AnalyseProfil.css";
import img_stuff from "../../../assets/stuff.png";
import img_clock from "../../../assets/clock.png";
import img_attack from "../../../assets/attack1.png";
import img_defence from "../../../assets/defence1.png";
import img_attack1 from "../../../assets/attackGold1.png";
import img_defence1 from "../../../assets/defenceGold1.png";
import img_xp from "../../../assets/xpGold.png";


export default function AnalyseProfil() {

  const [str, setStr] = useState('');


  const [trackedAcc, setTrackedAcc] = useState([]);
  const [profil, setProfil] = useState([]);
  const [dlData, setDlData] = useState(false);

  useEffect(() => {
    if (dlData) {
      M.toast({ html: "ok" })
    }
  }, [dlData])




  useEffect(() => {
    // M.AutoInit();
  }, [dlData, trackedAcc]);

  return (
    <>

      <div className='container'>


      </div>

      <div className="container">

      </div>
    </>
  )
}
