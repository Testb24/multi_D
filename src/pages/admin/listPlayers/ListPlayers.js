// import { updateProfile } from 'firebase/auth';
import React, { useState, useEffect } from 'react'
import { fetchPlayersDataDB, updateUserRole } from './functionAdmin';

export default function ListPlayers() {
  const [players, setPlayers] = useState([]);
  const [modify, setModify] = useState(false);

  async function getDataPlayers() {
    const t = await fetchPlayersDataDB();
    setPlayers(t)
  }

  useEffect(() => {

    getDataPlayers();
  }, []);

  function updateProfile(uid, role, newRole) {
    // console.log(uid)
    updateUserRole(uid, role, newRole, true);
    setModify(false);
    getDataPlayers();
  }

  function removeRole(uid, role, newRole) {
    updateUserRole(uid, role, newRole, false);
    setModify(false);
    getDataPlayers();
  }

  // const role = ["Public", "Player", "HC"]

  return (
    <div className='container'>
      <p>v1</p>
      <div className="project-list section">
        {players && players.length > 0 &&
          <table className='highlight striped centered'>
            <thead>
              <tr>
                <th>Pseudo</th>
                <th>Compte</th>
                <th>Rôle</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {players.map((player, index) => {
                console.log(player)
                return (
                  <tr key={index}>
                    <td>{player.pseudo}</td>
                    <td>{player.compte}</td>
                    {/* <td>{player.role}</td> */}
                    <td>
                      {player.role && player.role.map((role, index) => {
                        console.log(player.role)
                        if (modify === player.uid && role !== "public" && role !== "admin") {  //  && player.role.includes("admin")
                          return (
                            <button key={index}
                              onClick={() => removeRole(player.uid, player.role, role)}
                            >{role}</button>
                          )
                        } else if (role !== "public") {
                          return (
                            <div key={index}>{role}</div>
                          )
                        }

                      })}
                    </td>
                    {modify === player.uid && player.role !== "Admin" &&
                      <td>
                        {/* <button className='btn green accent-4 z-depth-0' onClick={() => updateProfile(player.uid, player.role, "Public")}>Public</button> */}
                        {!player.role.includes("player") &&
                          <button className='btn green accent-4 z-depth-0 ' onClick={() => updateProfile(player.uid, player.role, "player")}>Player</button>}
                        {!player.role.includes("hc") &&
                          <button className='btn orange darken-1  z-depth-0' onClick={() => updateProfile(player.uid, player.role, "hc")}>HC</button>}
                      </td>}
                    {modify !== player.uid && player.role !== "Admin" && <td><button onClick={() => setModify(player.uid)} className='btn pink lighten-1 z-depth-0'>Modifier rôle</button></td>}
                    {modify !== player.uid && player.role === "Admin" && <td>Non modifiable</td>}
                  </tr>)
              })}
            </tbody>
          </table>}
      </div>
    </div>
  )
}
