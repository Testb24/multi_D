import React, { useState, useEffect } from 'react';
import { updateTroopsMur } from '../functionsGestionMur';

export default function Form({ mur, user, setMur }) {
  // console.log(mur)
  // console.log(user)
  const oldTroops = mur.assist.find(el => (el[0] === user.pseudo && el[1] === user.compte));
  // console.log(oldTroops)

  const [myTroops, setMyTroops] = useState(
    oldTroops !== undefined ? oldTroops.slice(2) : [0, 0, 0, 0, 0, 0, 0, 0]
  );

  useEffect(() => {

    const oldTroops2 = mur.assist.find(el => (el[0] === user.pseudo && el[1] === user.compte));
    setMyTroops(oldTroops2 !== undefined ? oldTroops2.slice(2) : [0, 0, 0, 0, 0, 0, 0, 0])

  }, [mur])


  function handleChange(e, index) {
    // console.log(e, index)
    if (e >= 0) {
      const temp = [...myTroops.slice(0, index), e, ...myTroops.slice(index + 1)];
      temp[index] = parseInt(e);
      setMyTroops(temp);
    }
  }

  async function saveChanges() {
    let s = 0;
    myTroops.forEach(el => s += el)
    if (s !== 0) {
      const newMur = await updateTroopsMur(user, myTroops, mur);
      setMur(newMur);
    } else {
      alert('aucune troupe en entrée')
    }

  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Phalanges</th>
            <th>Druides</th>
            <th>Hédouins</th>
            <th>Légionnaires</th>
            <th>Prétoriens</th>
            <th>Caesaris</th>
            <th>Lances</th>
            <th>Paladins</th>
          </tr>
        </thead>
        <tbody>
          {mur.assist &&
            <tr>
              {myTroops.map((cell, index) => {
                // console.log(troops)
                // console.log('aaa')
                return (
                  <th key={index}>
                    <input
                      onChange={(e) => handleChange(e.target.value, index)}
                      type='number'
                      value={myTroops[index]}>
                    </input>
                  </th>)
              })}
            </tr>
          }
        </tbody>
      </table>

      <button onClick={saveChanges} className={'btn green accent-4 z-depth-1 '}>
        {"Sauvegarder"}
      </button>
    </>
  )
}
