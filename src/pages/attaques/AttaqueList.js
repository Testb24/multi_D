import React, { useState, useEffect } from 'react';
import { fetchAttacksDataDB } from './functionAttaque';

function AttaqueList() {

  const [attaques, setAttaques] = useState([]);

  async function getDataAttaques() {
    const t = await fetchAttacksDataDB();
    console.log(t)
    setAttaques(t)
  }

  useEffect(() => {

    getDataAttaques();
  }, []);

  return (
    <div className='container'>
      <div className="project-list section">
        {attaques && attaques.length > 0 &&
          <table className='highlight striped centered'>
            <thead>
              <tr>
                <th>Vivi attaquant</th>
                <th>Vivi cible</th>
                <th>Impact</th>
                <th>Trajet</th>
                <th>Vagues</th>
                <th>Troupes</th>
              </tr>
            </thead>

            <tbody>
              {attaques.map((attaque, index) => {
                return (
                  <tr key={index}>
                    <td>{attaque.off.X + "/" + attaque.off.Y}</td>
                    <td>{attaque.def.X + "/" + attaque.def.Y}</td>
                    {/* <td>{attaque.time.impact}</td> */}
                    <td>{(new Date(attaque.time.impact)).toLocaleString()}</td>
                    <td>{attaque.time.path}</td>
                    <td>{attaque.detail.vague}</td>
                    <td>{attaque.detail.troupes}</td>
                  </tr>)

              })}
            </tbody>
          </table>}
      </div>
    </div>
  )
}

export default AttaqueList
