import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../config/functionFB";
import { query, collection, getDocs, where } from "firebase/firestore";
import M from 'materialize-css';
const SignedInLinks = () => {

  const [userData, setUserData] = useState(false)

  // const auth = getAuth();
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     const uid = user.uid;
  //     setUser(user.email)
  //   } else {
  //   }
  // });

  const [user, loading, error] = useAuthState(auth);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  // const fetchUserDataDB = async () => {

  //   // console.log(user.uid)
  //   try {
  //     const q = query(collection(db, "users"), where("uid", "==", user?.uid));
  //     const doc = await getDocs(q);
  //     const data = doc.docs[0].data();
  //     setData(data);
  //   } catch (err) {
  //     console.error(err);
  //     
  // M.toast({ html: "An error occured while fetching user data3", displayLength: 4000 });
  //   }
  // };

  async function fetchUserDataDB() {

    // console.log(user.uid)
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data2 = doc.docs[0].data();
      setData(data2);
    } catch (err) {
      console.error(err);
      // 
      M.toast({ html: "An error occured while fetching user data4", displayLength: 4000 });
      M.toast({ html: "An error occured while fetching user data5", displayLength: 4000 });
    }
  };

  // useEffect(() => {
  //   if (loading) return;
  //   if (!user) return navigate("/");
  //   // console.log(user)
  //   fetchUserDataDB();
  // }, [user, loading]);

  useEffect(() => {
    // if (loading) return;
    // if (!user) return navigate("/");
    // console.log(user)
    fetchUserDataDB();
  }, []);

  const disconnect = async () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setUserData(false)
      console.log("déconnexion réussie")
      M.toast({ html: "déconnexion réussie", displayLength: 4000 });
    }).catch((error) => {
      console.log(error)
      M.toast({ html: "erreur", displayLength: 4000 });
    });
  }

  const location = useLocation();

  const [tab, setTab] = useState("attaques")

  useEffect(() => {

    if (location.pathname.split("/").includes("attaques")) { setTab("attaques") }
    else if (location.pathname.split("/").includes("defence")) { setTab("defence") }
    else if (location.pathname.split("/").includes("admin")) { setTab("admin") }
    else if (location.pathname.split("/").includes("profil")) { setTab("profil") }
    else if (location.pathname.split("/").includes("hc")) { setTab("hc") }
    // else setTab(null)

  }, [location])

  // console.log(data.role)
  // console.log(data.role.includes("admin"))
  return (
    <>
      <div className="nav-wrapper">
        <ul className="right">
          {data.role && data.role.includes("admin") && <li><NavLink to='/admin'>Admin</NavLink></li>}
          {data.role && data.role.includes("hc") && <li><NavLink to='/hc'>HC</NavLink></li>}
          <li><NavLink to='/attaques' >Attaques</NavLink></li>
          <li><NavLink to='/defence' >{"Mur, Synchro & Spy"}</NavLink></li>
          <li><NavLink to='/' onClick={disconnect}>Déconnexion</NavLink></li>
          <li><NavLink to='/profil' className="btn pink lighten-1">{data.pseudo}</NavLink></li>
        </ul>
      </div>

      <div className='nav-content'>

        {tab === "attaques" &&
          <ul className="tabs tabs-transparent">
            <li className="tab"><NavLink to='/attaques/add'>Nouvelle Attaque</NavLink></li>
            <li className="tab"><NavLink to='/attaques/list'>Liste des Attaques</NavLink></li>
            <li className="tab"><NavLink to='/hc/z'>{"Analyse Z"}</NavLink></li>
          </ul>}

        {tab === "defence" &&
          <ul className="tabs tabs-transparent">
            <li className="tab"><NavLink to='/defence/mur'>Mur</NavLink></li>
            <li className="tab"><NavLink to='/defence/synchro'>Synchro</NavLink></li>
            <li className="tab"><NavLink to='/defence/spy'>Spy</NavLink></li>
          </ul>}

        {tab === "hc" && data.role && data.role.includes("hc") &&
          <ul className="tabs tabs-transparent">
            <li className="tab"><NavLink to='/hc/def'>{"Analyse attaques"}</NavLink></li>
            <li className="tab"><NavLink to='/hc/trajets'>{"Analyse trajets"}</NavLink></li>
            <li className="tab"><NavLink to='/hc/voff'>{"Analyse voff"}</NavLink></li>
            <li className="tab"><NavLink to='/hc/wall'>{"Validation mur, spy et synchros"}</NavLink></li>
            <li className="tab"><NavLink to='/hc/vivis'>{"Gestion vivis"}</NavLink></li>
            <li className="tab"><NavLink to='/hc/vdef'>{"Analyse vdef"}</NavLink></li>
          </ul>}

        {tab === "admin" && data.role && data.role.includes("admin") &&
          <ul className="tabs tabs-transparent">
            <li className="tab"><NavLink to='/admin/players'>Joueurs</NavLink></li>
          </ul>}

      </div>
    </>
  )
}

export default SignedInLinks
