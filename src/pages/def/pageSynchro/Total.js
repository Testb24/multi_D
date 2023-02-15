import React, { useEffect, useState } from 'react';

export default function Total({ mur }) {

  // console.log(mur)
  const [totalTroops, setTotalTroops] = useState({ troops: [0, 0, 0, 0, 0, 0, 0, 0], empty: true });

  useEffect(() => {
    // console.log("calcul le total")
    setTotalTroops(compteTroops())
  }, [mur])

  function compteTroops() {
    let empty = true;
    const temp = [0, 0, 0, 0, 0, 0, 0, 0];
    if (mur !== null && mur.assist.length > 0) {
      mur.assist.forEach(ligne => {
        for (let i = 0; i < temp.length; i++) {
          temp[i] += ligne[i + 2];
          if (ligne[i + 2] !== 0) { empty = false }
        }
      })
    }
    return { troops: temp, empty: empty };
  }

  return (
    <>
      {!totalTroops.empty && totalTroops !== [0, 0, 0, 0, 0, 0, 0, 0] && <table>
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
          <tr>
            {totalTroops.troops &&
              totalTroops.troops.map((ligne, index) => {
                return (<th key={index}>{totalTroops.troops[index]}</th>)
              })
            }
          </tr>
        </tbody>
      </table>}
    </>
  )
}
