import React, { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";

import { auth, registerWithEmailAndPassword } from "../../config/functionFB"

function SignUp() {

  const [user, loading, error] = useAuthState(auth);
  const [data, setData] = useState({ email: '', password: '', pseudo: '', compte: '' })
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/profil");
  }, [user, loading]);

  function handleChange(e) {
    setData({
      ...data,
      [e.target.id]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log(data);

    registerWithEmailAndPassword(
      data.compte,
      data.pseudo,
      data.email,
      data.password
    )
  }

  return (
    <div className="container">
      <form className="white" onSubmit={handleSubmit}>
        <h5 className="grey-text text-darken-3">Sign Up</h5>
        <div className="input-field">
          <label htmlFor="email">Email</label>
          <input type="email" id='email' onChange={handleChange} value={data.email} />
        </div>
        <div className="input-field">
          <label htmlFor="password">Password</label>
          <input type="password" id='password' onChange={handleChange} value={data.password} />
        </div>
        <div className="input-field">
          <label htmlFor="pseudo">Pseudo</label>
          <input type="text" id='pseudo' onChange={handleChange} value={data.pseudo} />
        </div>
        <div className="input-field">
          <label htmlFor="compte">Compte travian</label>
          <input type="text" id='compte' onChange={handleChange} value={data.compte} />
        </div>
        {/* <div className="input-field">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id='lastName' onChange={handleChange} />
          </div> */}
        <div className="input-field">
          <button className="btn pink lighten-1 z-depth-0">Sign Up</button>
        </div>
      </form>
    </div>
  )

}

export default SignUp
