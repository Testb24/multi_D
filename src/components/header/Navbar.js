import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks';

import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {

  const [userMail, setUserMail] = useState(false)

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    // console.log(user);
    // console.log("here");
    if (user) {
      const uid = user.uid;
      setUserMail(user.email)
      // console.log(user)
    } else {
      setUserMail(false)
    }
  });

  return (
    <nav className={userMail && userMail !== false ? "nav-extended grey darken-3" : "grey darken-3"}>
      {userMail && userMail !== false ? <SignedInLinks /> : <SignedOutLinks />}
    </nav>
  )
}

export default Navbar
