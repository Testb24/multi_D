import React, { useState, useEffect } from 'react';
import { getAll, updateMur, deleteMur, validateMur } from '../../def/functionsGestionMur';
import './ValideMur.css';

export default function ValideMur() {

  const [data, setData] = useState({})

  async function getDataAll() {
    const data = await getAll();
    setData(data)
    console.log(data)
  }

  useEffect(() => {
    getDataAll();
  }, []);

  const [ligneFocused, setLigneFocused] = useState(false);
  const [oldData, setOldData] = useState(false);

  const [showMur, setShowMur] = useState(false);
  const [showSpy, setShowSpy] = useState(false);
  const [showSynchro, setShowSynchro] = useState(false);

  return (
    <div>

      <div className='div_btn'>
        <button
          // className={showMur ? "btn green accent-4 z-depth-1 btn_action" : "btn orange darken-1  z-depth-1 btn_action"}
          className={showMur ? "btn green accent-4 z-depth-1 btn_action" : "btn grey  z-depth-1 btn_action"}
          onClick={() => setShowMur(!showMur)}>
          Mur
        </button>
        <button
          className={showSpy ? "btn green accent-4 z-depth-1 btn_action" : "btn grey  z-depth-1 btn_action"}
          onClick={() => setShowSpy(!showSpy)}>
          Spy
        </button>
        <button
          className={showSynchro ? "btn green accent-4 z-depth-1 btn_action" : "btn grey z-depth-1 btn_action"}
          onClick={() => setShowSynchro(!showSynchro)}>
          Synchro
        </button>
      </div>

      {showMur &&
        <>

          <h2 className='sous_titre'>Mur</h2>

          {showMur && <div className='barre_noire'></div>}

          <table className='container striped highlight centered'>
            <thead>
              <tr>
                <th>impact</th>
                <th>cible</th>
                {/* <th>type</th> */}
                <th>troupes demandées</th>
                <th>Etat</th>
                <th>action</th>
              </tr>
            </thead>

            <tbody className='mur_tableau'>
              {data && data.murs && data.murs.length > 0 && data.murs.map(ligne => {
                console.log(ligne)
                if (ligneFocused.id !== ligne.id) {
                  return (
                    <tr key={ligne.id}>
                      {/* <th>{(new Date(ligne.firstImpact)).toString()}</th> */}
                      <td>{(new Date(ligne.firstImpact)).toLocaleString()}</td>
                      <td>{ligne.def.X + '/' + ligne.def.Y}</td>
                      {/* <th>{ligne.type}</th> */}
                      <td>{ligne.troupesObj}</td>
                      <td>{ligne.valide === false ? "non validé" : ligne.valide === true ? "validé" : "non validé"}</td>
                      <td className='aaa'>

                        <button key={1} className='btn orange darken-1  z-depth-1 btn_action'
                          onClick={() => {
                            setLigneFocused(ligne)
                            setOldData(ligne.troupesObj)
                          }}
                        >
                          Modifier
                        </button>

                        <button
                          key={2}
                          className='btn green accent-4 z-depth-1 btn_action'
                          onClick={() => {
                            validateMur(ligne)
                          }}>
                          Valider
                        </button>

                        <button
                          key={3}
                          className='btn red darken-3 z-depth-1 btn_action'
                          onClick={() => {
                            deleteMur(ligne)
                          }}>
                          Supprimer
                        </button>
                        {/* btn green accent-4 z-depth-0 btn orange darken-1  z-depth-0' */}
                      </td>
                    </tr>
                  )
                } else {
                  return (
                    <tr key={ligne.id}>
                      <td>{ligne.firstImpact}</td>
                      <td>{ligne.def.X + '/' + ligne.def.Y}</td>
                      <td>{ligne.type}</td>
                      <td>
                        <input
                          className='mur_table_input col s2'
                          type='number'
                          value={ligneFocused.troupesObj}
                          onChange={(e) => {
                            // console.log(e.target.value)
                            setLigneFocused({ ...ligneFocused, troupesObj: parseInt(e.target.value) })
                          }}>
                        </input>
                      </td>
                      <td>
                        <button
                          key={4}
                          className='btn green accent-4 z-depth-1'
                          onClick={() => { updateMur(ligneFocused); setLigneFocused(false) }}
                          disabled={oldData == ligneFocused.troupesObj ? true : false}
                        >
                          Valider
                        </button>
                      </td>
                    </tr>
                  )
                }


              })

              }
            </tbody>
          </table>

          {data && data.murs && ((showSpy || showSynchro) && data.murs.length > 8) &&
            <div className='div_btn'>
              <button
                // className={showMur ? "btn green accent-4 z-depth-1 btn_action" : "btn orange darken-1  z-depth-1 btn_action"}
                className={showMur ? "btn green accent-4 z-depth-1 btn_action" : "btn grey  z-depth-1 btn_action"}
                onClick={() => setShowMur(!showMur)}>
                Mur
              </button>
              <button
                className={showSpy ? "btn green accent-4 z-depth-1 btn_action" : "btn grey  z-depth-1 btn_action"}
                onClick={() => setShowSpy(!showSpy)}>
                Spy
              </button>
              <button
                className={showSynchro ? "btn green accent-4 z-depth-1 btn_action" : "btn grey z-depth-1 btn_action"}
                onClick={() => setShowSynchro(!showSynchro)}>
                Synchro
              </button>
            </div>}

        </>}


      {showSpy &&
        <>

          <h2 className='sous_titre'>Spy</h2>

          {showSpy && <div className='barre_noire'></div>}

          <table className='container striped highlight centered'>
            <thead>
              <tr>
                {/* <th>impact</th> */}
                <th>cible</th>
                {/* <th>type</th> */}
                <th>troupes demandées</th>
                <th>Etat</th>
                <th>action</th>
              </tr>
            </thead>

            <tbody className='mur_tableau'>
              {data && data.spys && data.spys.length > 0 && data.spys.map(ligne => {
                console.log(ligne)
                if (ligneFocused.id !== ligne.id) {
                  return (
                    <tr key={ligne.id}>
                      {/* <th>{(new Date(ligne.firstImpact)).toString()}</th> */}
                      {/* <th>{(new Date(ligne.firstImpact)).toLocaleString()}</th> */}
                      <th>{ligne.off.X + '/' + ligne.off.Y}</th>
                      {/* <th>{ligne.type}</th> */}
                      <th>{ligne.troupesObj}</th>
                      <th>{ligne.valide === false ? "non validé" : ligne.valide === true ? "validé" : "non validé"}</th>
                      <th className='aaa'>

                        <button key={1} className='btn orange darken-1  z-depth-1 btn_action'
                          onClick={() => {
                            setLigneFocused(ligne)
                            setOldData(ligne.troupesObj)
                          }}
                        >
                          Modifier
                        </button>

                        <button
                          key={2}
                          className='btn green accent-4 z-depth-1 btn_action'
                          onClick={() => {
                            validateMur(ligne)
                          }}>
                          Valider
                        </button>

                        <button
                          key={3}
                          className='btn red darken-3 z-depth-1 btn_action'
                          onClick={() => {
                            deleteMur(ligne)
                          }}>
                          Supprimer
                        </button>
                        {/* btn green accent-4 z-depth-0 btn orange darken-1  z-depth-0' */}
                      </th>
                    </tr>
                  )
                } else {
                  return (
                    <tr key={ligne.id}>
                      <th>{ligne.firstImpact}</th>
                      <th>{ligne.def.X + '/' + ligne.def.Y}</th>
                      <th>{ligne.type}</th>
                      <th>
                        <input
                          className='mur_table_input col s2'
                          type='number'
                          value={ligneFocused.troupesObj}
                          onChange={(e) => {
                            // console.log(e.target.value)
                            setLigneFocused({ ...ligneFocused, troupesObj: parseInt(e.target.value) })
                          }}>
                        </input>
                      </th>
                      <th>
                        <button
                          key={4}
                          className='btn green accent-4 z-depth-1'
                          onClick={() => { updateMur(ligneFocused); setLigneFocused(false) }}
                          disabled={oldData == ligneFocused.troupesObj ? true : false}
                        >
                          Valider
                        </button>
                      </th>
                    </tr>
                  )
                }


              })

              }
            </tbody>
          </table>

          {data && data.spys && (showSynchro && data.spys.length > 8) &&
            <div className='div_btn'>
              <button
                // className={showMur ? "btn green accent-4 z-depth-1 btn_action" : "btn orange darken-1  z-depth-1 btn_action"}
                className={showMur ? "btn green accent-4 z-depth-1 btn_action" : "btn grey  z-depth-1 btn_action"}
                onClick={() => setShowMur(!showMur)}>
                Mur
              </button>
              <button
                className={showSpy ? "btn green accent-4 z-depth-1 btn_action" : "btn grey  z-depth-1 btn_action"}
                onClick={() => setShowSpy(!showSpy)}>
                Spy
              </button>
              <button
                className={showSynchro ? "btn green accent-4 z-depth-1 btn_action" : "btn grey z-depth-1 btn_action"}
                onClick={() => setShowSynchro(!showSynchro)}>
                Synchro
              </button>
            </div>}


        </>}

      {showSynchro &&
        <>

          <h2 className='sous_titre'>Synchro</h2>

          {showSynchro && <div className='barre_noire'></div>}

          <table className='container striped highlight centered'>
            <thead>
              <tr>
                <th>impact</th>
                <th>cible</th>
                {/* <th>type</th> */}
                <th>troupes demandées</th>
                <th>Etat</th>
                <th>action</th>
              </tr>
            </thead>

            <tbody className='mur_tableau'>
              {data && data.synchros && data.synchros.length > 0 && data.synchros.map(ligne => {
                console.log(ligne)
                if (ligneFocused.id !== ligne.id) {
                  return (
                    <tr key={ligne.id}>
                      {/* <th>{(new Date(ligne.firstImpact)).toString()}</th> */}
                      <th>{(new Date(ligne.impact)).toLocaleString()}</th>
                      <th>{ligne.def.X + '/' + ligne.def.Y}</th>
                      {/* <th>{ligne.type}</th> */}
                      <th>{ligne.troupesObj}</th>
                      <th>{ligne.valide === false ? "non validé" : ligne.valide === true ? "validé" : "non validé"}</th>
                      <th className='aaa'>

                        <button key={1} className='btn orange darken-1  z-depth-1 btn_action'
                          onClick={() => {
                            setLigneFocused(ligne)
                            setOldData(ligne.troupesObj)
                          }}
                        >
                          Troupes demandées
                        </button>

                        <button
                          key={2}
                          className='btn green accent-4 z-depth-1 btn_action'
                          onClick={() => {
                            validateMur(ligne)
                          }}>
                          Valider
                        </button>

                        <button
                          key={3}
                          className='btn red darken-3 z-depth-1 btn_action'
                          onClick={() => {
                            deleteMur(ligne)
                          }}>
                          Supprimer
                        </button>
                        {/* btn green accent-4 z-depth-0 btn orange darken-1  z-depth-0' */}
                      </th>
                    </tr>
                  )
                } else {
                  return (
                    <tr key={ligne.id}>
                      <th>{ligne.firstImpact}</th>
                      <th>{ligne.def.X + '/' + ligne.def.Y}</th>
                      <th>{ligne.type}</th>
                      <th>
                        <input
                          className='mur_table_input col s2'
                          type='number'
                          value={ligneFocused.troupesObj}
                          onChange={(e) => {
                            // console.log(e.target.value)
                            setLigneFocused({ ...ligneFocused, troupesObj: parseInt(e.target.value) })
                          }}>
                        </input>
                      </th>
                      <th>
                        <button
                          key={4}
                          className='btn green accent-4 z-depth-1'
                          onClick={() => { updateMur(ligneFocused); setLigneFocused(false) }}
                          disabled={oldData == ligneFocused.troupesObj ? true : false}
                        >
                          Valider
                        </button>
                      </th>
                    </tr>
                  )
                }


              })

              }
            </tbody>
          </table>




        </>}

      {(showMur || showSpy || showSynchro) && <div className='div_btn'>
        <button
          // className={showMur ? "btn green accent-4 z-depth-1 btn_action" : "btn orange darken-1  z-depth-1 btn_action"}
          className={showMur ? "btn green accent-4 z-depth-1 btn_action" : "btn grey  z-depth-1 btn_action"}
          onClick={() => setShowMur(!showMur)}>
          Mur
        </button>
        <button
          className={showSpy ? "btn green accent-4 z-depth-1 btn_action" : "btn grey  z-depth-1 btn_action"}
          onClick={() => setShowSpy(!showSpy)}>
          Spy
        </button>
        <button
          className={showSynchro ? "btn green accent-4 z-depth-1 btn_action" : "btn grey z-depth-1 btn_action"}
          onClick={() => setShowSynchro(!showSynchro)}>
          Synchro
        </button>
      </div>}

    </div>
  )
}
