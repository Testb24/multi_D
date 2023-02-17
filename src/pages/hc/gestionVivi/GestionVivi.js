import React, { useEffect, useState } from 'react';
import './GestionVivi.css';
import { fetchPlayersCOA, fetchVivisCOA, saveVivi5, fetchVivi } from './functions_gestionVivi';
import { arrayRemove } from 'firebase/firestore';

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
    let listVivis = await fetchVivisCOA(playerId);
    setVivis(listVivis);
    listVivis = listVivis.sort((a, b) => b.Pop - a.Pop);
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


  const [coo, setCoo] = useState([26, 83]);
  function handleChangeCoo(value, i) {

    if (value > -400 && value < 400) {
      let temp = coo;
      temp[i] = parseInt(value);
      setCoo([].concat(temp))
    }

  }

  async function searchTown() {
    console.log(coo)
    let a = await fetchVivi(coo)
    console.log(a)
    setVivis(a)
  }
  // 3 gaulois
  // 2 germain
  // 1 romain
  // 5 natar

  async function handleChangeTroops(vivi, value, field) {
    console.log("handleCHangeTroops")
    // console.log(vivi)
    let temp = villages_5_data;

    let i = temp.findIndex(el => el._id === vivi._id)
    let k = vivis.findIndex(v => v._id === vivi._id)
    let temp2 = vivis;
    console.log(i)

    if (i === -1) {
      if (vivi.troops) {

        vivi.troops[field] = value;
      } else {
        vivi.troops = [0, 0, 0];
        vivi.troops[field] = value;
      }
      temp2[k] = vivi;
      temp.push(vivi);

    } else {

      if (temp[i].troops) {

        temp[i].troops[field] = value;
      } else {
        // console.log("WAY 4")
        temp[i].troops = [0, 0, 0];
        temp[i].troops[field] = value;
      }
      temp2[k] = temp[i];
    }


    // let k = vivis.findIndex(v => v._id === vivi._id)
    // let temp2 = vivis;
    // if (vivi.role && vivi.role.length > 0) {
    //   temp2[k].role.push(newRole);
    // } else {
    //   temp2[k].role = [newRole];
    // }
    // if(i === )
    // temp2[k] = temp[i]
    console.log(temp2)
    console.log([...temp])
    setVivis(temp2);

    setVivi5([...temp])
  }


  return (
    <div>
      <h2>Gestion des vivis COA</h2>

      <div className='GV_select_top_wrap'>

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

        <div className='GV_input_wrap'>

          <div className='GV_input_wrap'>
            {/* <span>X : </span> */}
            <p className=''>X :</p>
            <input
              max={400}
              min={-400}
              type="number"
              value={coo[0]}
              onChange={(e) => handleChangeCoo(e.target.value, 0)}
              className='browser-default GV_input'
              id='ptMax'
            ></input>
          </div>

          <div className='GV_input_wrap'>
            <p htmlFor="player-select ">Y :</p>
            <input
              max={400}
              min={-400}
              type="number"
              value={coo[1]}
              onChange={(e) => handleChangeCoo(e.target.value, 1)}
              className='browser-default GV_input'
              id='ptMax'
            ></input>
          </div>

          <button
            className='btn blue'
            onClick={() => searchTown()}>Search</button>
        </div>


      </div>

      {vivis && vivis.length > 0 && <button
        onClick={() => handleSave()}
      >Save changes</button>}

      {vivis && vivis.length > 0 && <div className='effectCompte_wrap'>
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
      </div>}


      <table>
        <thead>
          <tr>
            {/* <th>Compte ig</th> */}
            <th>Nom vivi</th>
            <th>Pop</th>
            <th>Coo</th>
            <th>Rôle</th>
            <th>Troupes (en k)</th>
          </tr>
        </thead>
        <tbody>
          {vivis && vivis.length > 0 && vivis.map((vivi, index) => {
            console.log(vivi)
            return (
              <tr key={index}>
                <th>{vivi.Vn}</th>
                <th>{vivi.Pop}</th>
                <th>
                  <a href={"https://ts1.x1.europe.travian.com/position_details.php?x=" + vivi.X + "&y=" + vivi.Y}
                    target="_blank" rel="noreferrer" >
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
                <th>
                  {/* NATAR */}
                  {vivi.T === "5" &&
                    <p>Natar</p>

                  }
                  {vivi.T !== "5" &&
                    <table>
                      <thead>
                        <tr>
                          {vivi.T === "1" &&
                            <>
                              <th>impé</th>
                              <th>toris</th>
                              <th>cae</th>
                            </>
                          }
                          {vivi.T === "2" &&
                            <>
                              <th>gg</th>
                              <th>h</th>
                              <th>teu</th>
                            </>
                          }
                          {vivi.T === "3" &&
                            <>
                              <th>ep</th>
                              <th>touta</th>
                              <th>hed</th>
                            </>
                          }
                          <th>b</th>
                          <th>cat</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {Array(5).fill(0).map((el, index) => {
                            console.log(index)
                            return (
                              <th>
                                <input
                                  min={0}
                                  type="number"
                                  value={vivi.troops ? vivi.troops[index] : 0}
                                  onChange={(e) => handleChangeTroops(vivi, e.target.value, index)}
                                  className='browser-default GV_input_troops'
                                  id='ptMin'
                                ></input>
                              </th>
                            )
                          })}
                        </tr>
                      </tbody>
                    </table>

                  }
                  {/* GERMAIN */}


                </th>
              </tr>)
          })
          }
        </tbody>
      </table>

    </div >

  )
}