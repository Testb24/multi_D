import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth, sendPasswordReset } from "../../config/functionFB"

function Reset() {

  const [user, loading, error] = useAuthState(auth);
  const [data, setData] = useState({ email: '' })
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/profil");
  }, [user, loading]);

  function handleChange(e) {
    setData({
      ...data,
      [e.target.id]: e.target.value
    })
  }

  function handleSubmit(e) {
    e.preventDefault();

    sendPasswordReset(data.email)
  }

  return (
    <div className="container">
      <form className="white" onSubmit={handleSubmit}>
        <h5 className="grey-text text-darken-3">Sign In</h5>
        <div className="input-field">
          <label htmlFor="email">Email</label>
          <input type="email" id='email' onChange={handleChange} value={data.email} />
        </div>
        <div className="input-field">
          <button className="btn pink lighten-1 z-depth-0">Reset</button>
        </div>
      </form>
    </div>
  )

}

export default Reset
