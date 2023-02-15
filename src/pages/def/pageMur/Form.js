import React, { useState, useEffect } from 'react';
import { updateTroopsMur, deleteLigneMur, saveIncrement } from '../functionsGestionMur';

export default function Form({ mur, user, setMur }) {
  // console.log(mur)
  // console.log(user)
  // console.log(mur)
  // console.log(oldTroops)

  function troopUser() {
    //lecture new way to save data (avec option d'incrémentation) => moins couteux et surtout, peut tourner en concurence
    let a = Object.getOwnPropertyNames(mur);
    // console.log(a)
    let troops = [0, 0, 0, 0, 0, 0, 0, 0]
    for (let k = 0; k < 8; k++) {
      let pattern = new RegExp(user.pseudo + "__" + k);
      const goodPpt = a.filter((el) => {
        let result = pattern.test(el)
        if (result) {
          troops[k] = mur[user.pseudo + "__" + k]
        }
      });
    }
    console.log("a")
    return troops;
  }

  const [myTroops, setMyTroops] = useState();

  const [myTroopsOld22, setMyTroopsOld22] = useState();

  useEffect(() => {
    let data = troopUser();
    setMyTroops(data);
    setMyTroopsOld22(data);
  }, [])

  function handleChange(e, index) {
    if (e >= 0) {
      const temp = [...myTroops.slice(0, index), e, ...myTroops.slice(index + 1)];
      temp[index] = parseInt(e);
      setMyTroops(temp);
    }
  }

  async function saveChanges() {
    myTroops.forEach((el, index) => {
      if (myTroops[index] !== myTroopsOld22[index]) {
        console.log("diff", index)
        saveIncrement(user, mur, myTroops[index] - myTroopsOld22[index], index)
      }
    })
  }

  async function deleteLigne() {
    const newMur = await deleteLigneMur(user, mur);
    setMur(newMur);
  }

  return (
    <>
      {mur.assist &&
        <tr>
          <th>{user.pseudo}</th>
          <th>{user.compte}</th>
          {myTroops && myTroops.length > 0 && myTroops.map((cell, index) => {
            // console.log(troops)
            // console.log('aaa')
            return (
              <th key={index}>
                <input
                  className='table_form'
                  onChange={(e) => handleChange(e.target.value, index)}
                  type='number'
                  value={myTroops[index]}>
                </input>
              </th>)
          })}
          <th>
            <button onClick={saveChanges} className={'btn green accent-4 z-depth-1 '}>
              {myTroops === undefined ? "Ajouter" : "Enregistrer"}
            </button>
            {myTroops !== undefined &&
              <button onClick={deleteLigne} className={'btn green accent-4 z-depth-1 '}>
                {"Supprimer"}
              </button>}
          </th>
        </tr>
      }
      {/* </tbody> */}
      {/* </table> */}


    </>
  )
}
