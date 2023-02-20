import React, { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom';

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Navigate } from "react-router-dom";

import { auth, db, logout } from "../../config/functionFB";
import { query, collection, getDocs, where } from "firebase/firestore";

import M from 'materialize-css';
// import { onAuthStateChanged, sendEmailVerification, getAuth } from "firebase/auth"
// import ListPlayers from '../admin/ListPlayers';

export default function ProtectedRoute2(props) {

    const [user, loading, error] = useAuthState(auth);
    const [data, setData] = useState({});
    const navigate = useNavigate();

    const fetchUserDataDB = async () => {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        // console.log(user.uid)
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setData(data);
        } catch (err) {
            console.error(err);
            M.toast({ html:"An error occured while fetching user data2", displayLength: 4000 });
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        // console.log(user)
        fetchUserDataDB();
        // fetchUserDataAUTH();
    }, [user, loading]);


    // if (data.role !== props.role && data.role !== undefined) {
    // console.log(props.role)
    // console.log(data.role)

    if (data.role && data.role.length > 0 && data.role.includes(props.role) && data.role !== undefined) {
        return props.children;
    } else if (data.role && data.role.length > 0 && data.role.includes(props.role) || data.role !== undefined) {
        return (<Navigate to="/" />);
    }
}
