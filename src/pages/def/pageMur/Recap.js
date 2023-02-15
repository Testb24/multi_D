import React, { useEffect, useState } from 'react';
import { deleteLigneMur } from '../functionsGestionMur';

export default function Recap({ mur, user, setMur }) {

  // console.log(mur)
  async function deleteLigne(ligne) {
    const newMur = await deleteLigneMur(user, ligne, mur);
    setMur(newMur);
  }

  let ans = [];

  return (
    <>
      {mur && mur !== null && mur.assist && mur.assist.length > 0 &&
        <>
          {/* <table> */}
          {/* <thead>
            <tr>
              <th>Pseudo</th>
              <th>Compte</th>
              <th>Phalanges</th>
              <th>Druides</th>
              <th>Hédouins</th>
              <th>Légionnaires</th>
              <th>Prétoriens</th>
              <th>Caesaris</th>
              <th>Lances</th>
              <th>Paladins</th>
            </tr>
          </thead> */}
          {/* <tbody> */}
          {mur.assist.filter(el => (el[0] !== user.pseudo && el[1] !== user.compte)).length > 0 &&
            mur.assist.filter(el => (el[0] !== user.pseudo && el[1] !== user.compte)).map((ligne, index) => {
              // console.log(ligne)
              // console.log(dataUser)
              return (
                <tr key={index}>
                  {ligne.map((cell, index) => {
                    return (<th key={index}>{ligne[index] === 0 ? "-" : ligne[index]}</th>)
                  })}
                  {/* {user && user.compte === ligne[1] &&
                    <th>
                      <button onClick={() => deleteLigne(ligne)}>X</button>
                    </th>} */}
                </tr>
              )
            })

          }
          {/* </tbody> */}
          {/* </table> */}
        </>
      }
    </>
  )
}
