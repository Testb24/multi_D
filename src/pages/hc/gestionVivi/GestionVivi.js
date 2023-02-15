import React, { useEffect, useState } from 'react';
import './GestionVivi.css';
import { fetchPlayersCOA, fetchVivisCOA, saveVivi5 } from './functions_gestionVivi';

export default function GestionVivi() {

  const allyId = ["41"];


  async function getDataPlayers() {
    const t = await fetchPlayersCOA(allyId);
    // console.log(t)
    setPlayers(t)
  }

  useEffect(() => {

    getDataPlayers();
  }, []);

  const [players, setPlayers] = useState();
  const [vivis, setVivis] = useState();

  async function handleChangePlayer(playerId) {
    console.log(playerId)
    // setPlayers(playerId);
    let listVivis = await fetchVivisCOA(playerId)
    setVivis(listVivis);
    listVivis = listVivis.sort((a, b) => b.Pop - a.Pop)
    console.log(listVivis);
  }

  const [villages_5_data, setVivi5] = useState([]);


  async function handleChangeRole(vivi, newRole) {
    // console.log(newRole)
    // console.log(vivi)
    let temp = villages_5_data;

    let i = temp.findIndex(el => el._id === vivi._id)
    // console.log(i)

    if (i === -1) {
      if (vivi.role) {
        // console.log("WAY 1")
        if (vivi.role.includes(newRole))
          return null;

        let a = vivi.role.push(newRole)
        temp.push({ ...vivi, role: vivi.role })
      } else {
        // console.log("WAY 2")
        temp.push({ ...vivi, role: [newRole] })
      }

    } else {

      if (temp[i].role) {
        // console.log("WAY 3")
        if (temp[i].role.includes(newRole))
          return null;

        temp[i].role.push(newRole)
      } else {
        // console.log("WAY 4")
        temp[i].role = [newRole]
      }
    }


    let k = vivis.findIndex(v => v._id === vivi._id)
    let temp2 = vivis;
    if (vivi.role && vivi.role.length > 0) {
      temp2[k].role.push(newRole);
    } else {
      temp2[k].role = [newRole];
    }

    setVivis(temp2);


    setVivi5([...temp])
  }
  async function handleChangeRoleAccount(newRole) {

    vivis.forEach(v => {
      handleChangeRole(v, newRole);
    });

  }
  async function handleDeleteRole(vivi, oldRole) {
    // console.log(oldRole);
    // console.log(vivi);
    let temp = villages_5_data;

    let i = temp.findIndex(el => el._id === vivi._id);
    // console.log(i);

    if (i === -1) {

      // console.log("WAY 1");
      let a = vivi.role.filter(el => el !== oldRole);
      temp.push({ ...vivi, role: a });


    } else {

      // console.log("WAY 3");
      let a = vivi.role.filter(el => el !== oldRole);
      temp[i].role = a;
    }


    let k = vivis.findIndex(v => v._id === vivi._id)
    let temp2 = vivis;

    temp2[k].role = temp2[k].role.filter(r => r !== oldRole);

    setVivis(temp2);


    setVivi5([...temp])
  }

  // useEffect(() => {
  //   console.log(villages_5_data)
  //   console.log(vivis)
  // }, [villages_5_data])

  const role = [
    "capi",
    "voff",
    "missile",
    "vdef",
    "vspy",
    "unique",
    "arté maj",
    "arté min",
    "autre"
  ]
  const roleAccount = [
    "maj spy",
    "unique spy"
  ]

  function handleSave() {
    console.log("saves changes")
    saveVivi5(villages_5_data);
  }


  return (
    <div>
      <h2>Gestion des vivis COA</h2>

      <button
        onClick={() => handleSave()}
      >Save changes</button>

      {/* <label htmlFor="player-select">Choose a player:</label> */}
      <select
        name="player"
        id="player-select"
        className="browser-default select_resize"
        onChange={(e) => handleChangePlayer(e.target.value)}
        defaultValue={"0"}
      >
        <option value="0" disabled>--Joueur--</option>
        {/* <option value="1">Test name</option> */}
        {players && players.length > 0 && players.map((player, index) => {
          return (
            <option key={index} value={player._id}>{player.Un}</option>
          )
        })}
      </select>

      <div className='effectCompte_wrap'>
        <p className='' >Effet compte</p>
        <select
          name="roleAcc"
          id="roleAcc-select"
          className="browser-default select_resize_effectCompte"
          onChange={(e) => handleChangeRoleAccount(e.target.value)}
          defaultValue={"0"}
        >
          <option value="0" disabled>--Arté compte--</option>
          {/* <option value="1">Test name</option> */}
          {roleAccount && roleAccount.length > 0 && roleAccount.map((role, index) => {
            return (
              <option key={index} value={role}>{role}</option>
            )
          })}
        </select>
      </div>


      <table>
        <thead>
          <tr>
            {/* <th>Compte ig</th> */}
            <th>Nom vivi</th>
            <th>Pop</th>
            <th>Coo</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          {vivis && vivis.length > 0 && vivis.map((vivi, index) => {
            return (
              <tr key={index}>
                <th>{vivi.Vn}</th>
                <th>{vivi.Pop}</th>
                <th>
                  <a href={"https://ts1.x1.europe.travian.com/position_details.php?x=" + vivi.X + "&y=" + vivi.Y}
                    target="_blank" >
                    {vivi.X + "/" + vivi.Y}
                  </a>
                </th>
                <th>
                  <select
                    name="role"
                    id="role-select"
                    className="browser-default select_resize"
                    onChange={(e) => handleChangeRole(vivi, e.target.value)}
                    defaultValue={"0"}
                  >
                    <option value="0" disabled>--Role--</option>
                    {/* <option value="1">Test name</option> */}
                    {role && role.length > 0 && role.map((role, index) => {
                      return (
                        <option key={index} value={role}>{role}</option>
                      )
                    })}
                  </select>
                  {vivi && vivi.role && vivi.role.length > 0 && vivi.role.map((role, index) => {
                    return (
                      <div
                        onClick={(e) => handleDeleteRole(vivi, role)}
                        key={index}>{role}</div>
                    )
                  })}
                </th>
              </tr>)
          })
          }
        </tbody>
      </table>

    </div>

  )
}


