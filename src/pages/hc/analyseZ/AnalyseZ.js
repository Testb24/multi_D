import React, { useEffect, useState } from 'react';
import { Parse_Profil } from './AnalyseZ_functions.js'
import M from 'materialize-css';

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
    console.log("===========")
    // console.log(attaques)
    // setAttaques(attaques);

    // setStr('');
    M.toast({html:'Saved', displayLength : 3000});
  }

  function showToast() {
    M.toast({html:'Hello World!', displayLength : 3000});
  }

  return (
    <>
      <a onClick={() => showToast()} className="btn">Toast!</a>
      {attaques && attaques.length === 0 &&
        <form className="white" onSubmit={handleSubmit}>
          <h5 className="grey-text text-darken-3">Analyser un z</h5>
          <div className="input-field">
            <button className="btn pink lighten-1">Extraire les infos</button>
          </div>
          <div className="input-field">
            {/* <textarea id="pr" className="materialize-textarea" onChange={handleChange} value={str}></textarea> */}
            <input type="text" id="pr" className="materialize-textarea" onChange={handleChange} value={str} />
            <label htmlFor="pr">Page de profil</label>
          </div>
          <div className="input-field">
            <button className="btn pink lighten-1">Extraire les infos</button>
          </div>
          <div className="input-field">
            <button
              // onClick={(e) => saveAttaques(e)}
              className="btn pink green accent-4"
              disabled={attaques.length > 0 ? false : true}
            >Sauvegarder les attaques
            </button>
          </div>
        </form>}
    </>
  )
}
