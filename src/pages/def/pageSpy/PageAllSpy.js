import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
// import PageSpy from './pageSpy/PageSpy';
import { updateSpy, updateSpyWithoutDataPlayer, CRUD_getAll } from '../functionsGestionMur';
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, onSnapshot, doc } from "firebase/firestore";
import { auth, db } from "../../../config/functionFB";
import { onAuthStateChanged, getAuth } from "firebase/auth"
import ModaleSpy from './ModaleSpy';
import M from 'materialize-css';
export default function PageAllSpy() {

  const [spys, setSpys] = useState();

  async function getTheData() {
    const data = await CRUD_getAll("spy")
    setSpys(data);
  }

  useEffect(() => {

    getTheData()

  }, [])

  const navigate = useNavigate();
  const [spyFocused, setSpyFocused] = useState(false);

  let location = useLocation();

  // console.log(location)

  useEffect(() => {
    if (location.pathname.split('/')[location.pathname.split('/').length - 1] === "spy") {
      setSpyFocused(false)
    } else if (!spyFocused) {
      // console.log(location)
      const wall = location.pathname.split('/')[location.pathname.split('/').length - 1]
      // console.log(wall)
      const spyTemp = spys.find(el => el.id == wall.toString())
      setSpyFocused(spyTemp)
      navigate('def/spy/' + wall.toString());
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
      
            M.toast({ html:"An error occured while fetching user data9", displayLength: 4000 });
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

  const [modale, setModale] = useState(false)
  const [data, setData] = useState({})

  function openModal(spy) {
    setSpyFocused(spy);
    setModale(true)
  }

  useEffect(() => {
    transition()

  }, [data])

  async function transition() {
    await updateSpy(spyFocused, data, dataUser)
  }

  async function deletePlayerUpdate(spy) {
    await updateSpyWithoutDataPlayer(spy)
  }

  return (
    <div className=''>
      <>
        <h4>Spys</h4>

        {modale && <ModaleSpy setModale={setModale} setData={setData}></ModaleSpy>}

        <table className='mur_table'>
          <thead className='mur_table_thead'>
            <tr>
              <th>X/Y</th>
              <th>Joueur/Compte</th>
              {/* <th>Heure impact</th> */}
              <th>Info</th>
              <th>Commentaire</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody className='mur_table_tbody'>
            {dataUser && spys && spys.length > 0 && spys.map((item, index) => {
              console.log(item)
              return (
                <tr
                  key={index}
                // onClick={() => openModal(item)}
                >
                  <th>
                    <a
                      href={"https://ts1.x1.europe.travian.com/position_details.php?x=" + item.off.X + "&y=" + item.off.Y}
                      target="_blank">{"Lien village (" + item.off.X + "/" + item.off.Y + ")"}
                    </a>
                  </th>
                  <th>{item.off.Un}</th>
                  {/* <th>{item.impact}</th> */}
                  {/* <th>{(new Date(item.impact)).toLocaleString()}</th> */}
                  <th>{item.info}</th>
                  <th>{item.commentaire}</th>
                  <th>
                    <button key="1" onClick={() => openModal(item)}>Valider un envoi</button>
                    {item.joueur === dataUser.pseudo + '/' + dataUser.compte &&
                      <button key="2" onClick={() => deletePlayerUpdate(item)}>Supprimer</button>
                    }
                  </th>
                </tr>
              )
            })}
          </tbody>
        </table>
      </>
      {/* } */}
    </div >
  )
}
