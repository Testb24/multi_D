import React, { useEffect, useState } from 'react';
import { saveAttacks, Parse_PR } from './functionAttaque';
import './style.css';

function AddAttaque() {

  const [str, setStr] = useState('');
  const [attaques, setAttaques] = useState([]);
  const [cleanTime, setCleanTime] = useState([false, false, false]);

  function handleChange(e) {
    setStr(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault();
    const attaques = Parse_PR(str);
    console.log("===========")
    console.log(attaques)
    setAttaques(attaques);

    setStr('');
  }

  function saveAttaques(e) {
    e.preventDefault();
    let temp = new Date();
    console.log(temp)
    if (cleanTime[1]) {
      temp.setHours(parseInt(cleanTime[1]));
    }
    if (cleanTime[2]) {
      temp.setMinutes(parseInt(cleanTime[2]));
    }

    // console.log(temp)
    if (cleanTime[0]) {
      temp.setDate(temp.getDate() - 1);
    }
    // console.log(temp)

    console.log('attaques sauvegardées !');
    // console.log(attaques);
    saveAttacks(attaques, temp);
  }

  function handleChangeHour(e, i) {
    console.log(e)
    let temp = [].concat(cleanTime);

    if (
      e <= 23 && e >= 0 && i === 1 || e <= 59 && e >= 0 && i === 2)
      temp[i] = e;
    setCleanTime(temp);
  }

  useEffect(() => {
    console.log(cleanTime)
  }, [cleanTime])

  return (
    <div className="container">

      {attaques && attaques.length === 0 && <form className="white" onSubmit={handleSubmit}>
        <h5 className="grey-text text-darken-3">Ajouter de nouvelles attaques</h5>
        <div className="input-field">
          <button className="btn pink lighten-1">extraire les attaques</button>
        </div>
        <div className="input-field">
          {/* <textarea id="pr" className="materialize-textarea" onChange={handleChange} value={str}></textarea> */}
          <input type="text" id="pr" className="materialize-textarea" onChange={handleChange} value={str} />
          <label htmlFor="pr">Place de rassemblement</label>
        </div>
        <div className="input-field">
          <button className="btn pink lighten-1">extraire les attaques</button>
        </div>
        <div className="input-field">
          <button
            onClick={(e) => saveAttaques(e)}
            className="btn pink green accent-4" disabled={attaques.length > 0 ? false : true}>Sauvegarder les attaques</button>
        </div>
      </form>}

      {attaques && attaques.length !== 0 &&
        <div>
          <p>Attaque arrivée après : </p>
          <div className='box_btn row'>

            {/* <div className="input-field col s4">
              <input
                type="checkbox"
                onChange={(e) => handleChangeHour(e.target.value, 0)}
                className='btn_h'
                id='day'
              ></input>
              <label htmlFor="day">Day</label>
            </div> */}

            <div className="input-field col s4">
              <label className=''>
                <input
                  type="checkbox"
                  value={cleanTime[0]}
                  onChange={() => handleChangeHour(!cleanTime[0], 0)}
                /><span className=''>{"hier ? "}</span>
              </label>
            </div>

            <div className="input-field col s4">
              <input
                max={23}
                min={0}
                type="number"
                value={cleanTime[1]}
                onChange={(e) => handleChangeHour(e.target.value, 1)}
                className='btn_h'
                id='h'
              ></input>
              <label htmlFor="h">Hour</label>
            </div>

            <div className="input-field col s4">
              <input
                max={59}
                min={0}
                type="number"
                value={cleanTime[2]}
                onChange={(e) => handleChangeHour(e.target.value, 2)}
                className='btn_h'
                id='h'
              ></input>
              <label htmlFor="h">Min</label>
            </div>

          </div>
        </div>}

      {/* Tableau récap des nouvelles attaques à ajouter */}
      {attaques && attaques.length > 0 &&
        <table className='highlight striped '>
          <thead>
            <tr>
              <th>Vivi attaquant</th>
              <th>Vivi cible</th>
              <th>Impact</th>
              <th>Trajet</th>
              <th>H serveur</th>
              <th>Troupes</th>
              <th>Vagues</th>
              <th>_id</th>
            </tr>
          </thead>

          <tbody>
            {attaques.map((attaque, index) => {
              return (
                <tr key={index}>
                  <td>{attaque.Voff_X + '/' + attaque.Voff_Y}</td>
                  <td>{attaque.Vdef_X + '/' + attaque.Vdef_Y}</td>
                  <td>{attaque.time_impact.toString()}</td>
                  {/* <th>{(new Date(ligne.firstImpact)).toLocaleString()}</th> */}
                  <td>{attaque.time_path + 'sec'}</td>
                  <td>{attaque.time_server.toString()}</td>
                  <td>{attaque.troupes}</td>
                  <td>{attaque.vague}</td>
                  <td>{attaque._id}</td>
                </tr>)

            })}
          </tbody>
        </table>}

      {attaques.length > 0 && <div className="input-field">
        <button
          onClick={(e) => saveAttaques(e)} className="btn pink green accent-4" disabled={attaques.length > 0 ? false : true}>Sauvegarder les attaques</button>

      </div>}

    </div>
  )

}

export default AddAttaque
