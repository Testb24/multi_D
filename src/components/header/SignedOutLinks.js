import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedOutLinks = () => {
  return (
    <div className="nav-wrapper">
      <ul className="right">
        <li><NavLink to='/signup'>Inscription</NavLink></li>
        <li><NavLink to='/signin'>Connexion</NavLink></li>
      </ul>
    </div>
  )
}

export default SignedOutLinks