import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import PageSynchro from './PageSynchro';
import { CRUD_getAll } from '../functionsGestionMur';
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, onSnapshot, doc } from "firebase/firestore";
import { auth, db } from "../../../config/functionFB";
import { onAuthStateChanged, getAuth } from "firebase/auth"

export default function PageAllSynchro() {

  const [synchros, setSynchros] = useState();

  async function getTheData() {
    const data = await CRUD_getAll("synchro")
    setSynchros(data);
  }

  useEffect(() => {

    getTheData()

  }, [])

  const navigate = useNavigate();
  const [synchroFocused, setSynchroFocused] = useState(false);

  let location = useLocation();

  // console.log(location)

  useEffect(() => {
    if (location.pathname.split('/')[location.pathname.split('/').length - 1] === "synchro") {
      setSynchroFocused(false)
    } else if (!synchroFocused) {
      console.log(location)
      const sync = location.pathname.split('/')[location.pathname.split('/').length - 1]
      console.log(sync)
      const synchroTemp = synchros.find(el => el.id == sync.toString())
      console.log(synchroTemp)
      setSynchroFocused(synchroTemp)
      navigate('def/synchro/' + sync.toString());
    }
  }, [location])

  //===================================================
  //===================================================
  //===================================================
  //===================================================

  const [user, loading, error] = useAuthState(auth);
  const [dataUser, setDataUser] = useState(null);

  const fetchUserDataDB = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    // console.log(user.uid)
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const t = doc.docs[0].data();
      // console.log(t)
      setDataUser(t);


    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    // console.log(user)
    fetchUserDataDB();
    fetchUserDataAUTH();
  }, [user, loading]);

  const [userData, setUserData] = useState(false)

  const fetchUserDataAUTH = async () => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserData(user)
      } else {
      }
    });
  }
  //===================================================
  //===================================================
  //===================================================
  //===================================================
  return (
    <div className='container'>

      {synchroFocused && dataUser !== {} && dataUser !== undefined && dataUser !== null &&
        <PageSynchro synchro={synchroFocused} user={dataUser} setSynchro={setSynchroFocused} />
      }

      {!synchroFocused &&
        <>
          <h4>Synchros</h4>
          <table className='mur_table'>
            <thead className='mur_table_thead'>
              <tr>
                <th>Compte</th>
                <th>Vivi attaqué</th>
                <th>X/Y</th>
                <th>Table getter</th>
              </tr>
            </thead>

            <tbody className='mur_table_tbody'>
              {synchros && synchros.length > 0 && synchros.map((item, index) => {
                if (item.valide !== false) {
                  console.log(item)
                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        setSynchroFocused(item);
                        navigate('def/synchro/' + item.id);
                      }}>
                      <td>{item.id}</td>
                      <td>{item.nom}</td>
                      <td>{item.id}</td>
                      {/* <td>{"/"}</td> */}
                      <td>
                        <a
                          target="_blank"
                          href={"http://www.gettertools.com/ts1.x1.europe.travian.com.3/def-table/" + (item.impact/1000) + "/" + item.def.X + "," + item.def.Y}>
                          table</a>
                      </td>
                    </tr>
                  )
                }

              })}
            </tbody>
          </table>
        </>}
    </div >
  )
}
