import React, { useEffect, useState } from 'react';
import { Parse_Profil, CRUD_getAll, CRUD_get } from './AnalyseZ_functions.js'
import M from 'materialize-css';
import "./AnalyseZ.css"

export default function AnalyseZ() {

  const [str, setStr] = useState('');
  const [attaques, setAttaques] = useState([]);
  // const [cleanTime, setCleanTime] = useState([false, false, false]);

  function handleChange(e) {
    setStr(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();
    const attaques = Parse_Profil(str);
    // console.log("===========")
    // console.log(attaques)
    // setAttaques(attaques);

    // setStr('');
    M.toast({ html: 'Saved', displayLength: 3000 });
  }

  const [trackedAcc, setTrackedAcc] = useState([]);
  const [profil, setProfil] = useState([]);
  const [dlData, setDlData] = useState(false);

  useEffect(() => {
    if (dlData) {
      M.toast({ html: "ok" })
      downloadTrackedData()
      // downloadProfil()
    }
  }, [dlData])

  async function downloadTrackedData() {

    let temp = await CRUD_getAll("attaques");
    let PlayerOff = []

    temp.forEach(att => {
      PlayerOff.push(att.off);
    })
    // console.log(PlayerOff)
    PlayerOff = PlayerOff.filter((el, i) => i === PlayerOff.findIndex(e => e.Uid == el.Uid))
    // console.log(PlayerOff)

    // temp = await CRUD_getAll("z");
    temp = await CRUD_get("z_record", "1");
    // console.log(tempTime)
    PlayerOff.map((pl, i) => {

      let tempTime = temp.dataTime.find(el => el.Uid === pl.Uid);
      // temp.filter(el => el.Uid === pl.Uid).map(el => tempTime.push(el.time));
      // console.log(tempTime)
      PlayerOff[i] = {
        player: pl,
        // screen: temp.filter(el => el.Uid === pl.Uid),
        last: tempTime === undefined ? 0 : tempTime.time
      }

    })

    // console.log(PlayerOff);
    PlayerOff.sort((a, b) => a.last - b.last)

    setTrackedAcc(PlayerOff);
  }


  return (
    <>
      {<form className="white container" onSubmit={handleSubmit}>
        <h5 className="grey-text text-darken-3">{"Enregistrer un profil joueur (points et héros)"}</h5>
        {/* <div className="input-field">
            <button className="btn pink lighten-1">Extraire les infos</button>
          </div> */}
        <div className="input-field row">
          {/* <textarea id="pr" className="materialize-textarea" onChange={handleChange} value={str}></textarea> */}
          <input type="text" id="pr" placeholder='page de profil' className="browser-default" onChange={handleChange} value={str} />
          {/* <label htmlFor="pr">Page de profil</label> */}
        </div>
        <div className="input-field">
          <button className="btn pink lighten-1">Extraire les infos et enregistrer</button>
        </div>
      </form>}

      <div className='container'>
        <h5 className="grey-text text-darken-3">Mettre à jour la BDD des profils ennemis</h5>
        <button
          onClick={() => { setDlData(true) }}
          className='btn'>
          {dlData ? "data chargée" : "yep"}
        </button>
      </div>

      <table className='container'>
        <thead>
          <tr>
            <th>Compte</th>
            <th>Dernier relevé</th>
            {/* <th>{ }</th> */}
          </tr>
        </thead>

        <tbody>
          {trackedAcc && trackedAcc.length > 0 && trackedAcc.map((playerOff, index) => {
            return (
              <tr key={index}>
                <th>
                  <a className='top_link'
                    href={
                      "https://ts1.x1.europe.travian.com/profile/" +
                      playerOff.player.Uid
                    }
                    target="_blank">
                    {playerOff.player.Un}
                  </a>
                </th>
                <th
                  className={(new Date() - playerOff.last) / 3600 / 1000 < 0.5 ?
                    "analyseZ_alerte_lvl3"
                    :
                    (new Date() - playerOff.last) / 3600 / 1000 < 1 ?
                      "analyseZ_alerte_lvl2"
                      :
                      "analyseZ_alerte_lvl1"
                  }
                >{playerOff.last ? new Date(playerOff.last).toLocaleString() : "<!>"}</th>
                {/* <th>{(new Date() - playerOff.last < 3600 * 1000 ? "ok" : "f")} </th> */}
                {/* <th>{(new Date() - playerOff.last) / 3600 / 1000 < 0.5} </th> */}
                {playerOff.last !== 0 &&
                  <th>{
                    Math.floor((new Date() - playerOff.last) / 3600000) % 3600 + 'h ' +
                    Math.floor((new Date() - playerOff.last) / 60000) % 60 + 'min ' +
                    Math.floor((new Date() - playerOff.last) / 1000) % 60 + 's '
                  }</th>}
              </tr>
            )
          })}
        </tbody>

      </table>

    </>
  )
}
