import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

import {auth,logInWithEmailAndPassword } from "../../config/functionFB"

function SignIn() {

  const [user, loading, error] = useAuthState(auth);
  const [data, setData] = useState({ email: '', password: '' })
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
    
    logInWithEmailAndPassword(data.email, data.password)
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
          <label htmlFor="password">Password</label>
          <input type="password" id='password' onChange={handleChange} value={data.password} />
        </div>
        <div className="input-field">
          <button className="btn pink lighten-1 z-depth-0">Login</button>
        </div>
      </form>
      <Link to="/reset">Mot de passe oublié</Link>
    </div>
  )

}

export default SignIn
