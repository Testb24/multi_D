import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import PageMur from './PageMur';
import { CRUD_getAll } from '../functionsGestionMur';
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, onSnapshot, doc } from "firebase/firestore";
import { auth, db } from "../../../config/functionFB";
import { onAuthStateChanged, getAuth } from "firebase/auth"
import M from 'materialize-css';
import "../PageAll.css"

export default function PageAllMur() {

  const [murs, setMurs] = useState([]);

  async function getTheData() {
    const data = await CRUD_getAll("mur");
    setMurs(data);
  }

  useEffect(() => {
    console.log("charge les datas pour les murs")
    getTheData()

  }, [])

  // console.log(murs)

  const navigate = useNavigate();
  const [murFocused, setMurFocused] = useState(false);

  useEffect(() => {
    console.log(murFocused)
  }, [murFocused])

  let location = useLocation();

  // console.log(location)

  useEffect(() => {
    console.log("useEffect de la location")
    // console.log(location.pathname.split('/')[location.pathname.split('/').length - 1])
    // console.log(!murFocused)
    // console.log(location.pathname)
    if (location.pathname.split('/')[location.pathname.split('/').length - 1] === "mur") {
      setMurFocused(false)
    } else if (!murFocused) {
      // console.log(location)
      const wall = location.pathname.split('/')[location.pathname.split('/').length - 1]
      // console.log(murs)
      const murTemp = murs.find(el => el.id == wall.toString())
      // console.log(murTemp)
      setMurFocused(murTemp)
      // navigate('' + wall.toString());
    }
  }, [location, murs])

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
      
            M.toast({ html:"An error occured while fetching user data7", displayLength: 4000 });
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
    <div className=''>

      {murFocused && dataUser !== {} && dataUser !== undefined && dataUser !== null &&
        <PageMur mur={murFocused} user={dataUser} setMur={setMurFocused} />
      }

      {!murFocused &&
        <>
          <h4>Murs</h4>
          <table className='mur_table'>
            <thead className='mur_table_thead'>
              <tr>
                <th>Nom</th>
                <th>Impact</th>
                <th>X/Y</th>
                <th>Remplissage</th>
                <th>Etat</th>
              </tr>
            </thead>

            <tbody className='mur_table_tbody'>
              {murs && murs.length > 0 && murs.map((item, index) => {
                // console.log(item)
                if (item.valide !== false)
                  return (
                    <tr
                      className={item.valide === true ? null : "table_cell_barrée"}
                      key={index}
                      onClick={() => {
                        setMurFocused(item);
                        navigate('' + item.id);
                      }}>
                      <td>{item.id}</td>
                      {/* <td>{item.firstImpact}</td> */}
                      <th>{(new Date(item.firstImpact)).toLocaleString()}</th>
                      <td>{"( " + item.def.X + " / " + item.def.Y + " )"}</td>
                      <td
                        className={
                          item.remplissage > 0.95 ? 'table_cell_remplissage_ok' :
                            item.remplissage > 0.8 ? 'table_cell_remplissage_close' :
                              'table_cell_remplissage_not'
                        }
                      >{Math.round(item.remplissage * 1000) / 10 + '%'}
                      </td>
                      <td className='table_cell_nonbarrée'>{item.valide === true ? "Ouvert" : "non validé".toLocaleUpperCase()}</td>
                    </tr>
                  )
              })}
            </tbody>
          </table>
        </>}
    </div >
  )
}
