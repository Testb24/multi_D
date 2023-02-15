import React, { useEffect, useState } from 'react';

export default function Total({ mur }) {

  // console.log(mur)
  const [totalTroops, setTotalTroops] = useState({ troops: [0, 0, 0, 0, 0, 0, 0, 0], empty: true });

  useEffect(() => {
    // console.log("calcul le total")
    let temp = compteTroops()
    setTotalTroops(temp)
  }, [mur])

  function compteTroops() {
    let empty = true;
    const temp = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let k = 0; k < 8; k++) {
      let a = Object.getOwnPropertyNames(mur);
      let pattern = new RegExp("__" + k);
      let ans = 0;
      const goodPpt = a.filter((el) => {
        let result = pattern.test(el)
        if (result) {
          ans += mur[el];
        }
      });
      if (ans !== 0) { empty = false }
      temp[k] = ans;
    }
    return { troops: temp, empty };

  }

  return (
    <>
      {!totalTroops.empty && totalTroops !== [0, 0, 0, 0, 0, 0, 0, 0] &&
        <table className='table_total'>
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
                  return (<th key={index}>{totalTroops.troops[index] === 0 ? "-" : totalTroops.troops[index]}</th>)
                })
              }
            </tr>
          </tbody>
        </table>}
    </>
  )
}
