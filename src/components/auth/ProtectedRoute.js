import React, { useState, useEffect } from 'react'
import { Route, Redirect } from 'react-router-dom';

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { auth, db, logout } from "../../config/functionFB";
import { query, collection, getDocs, where } from "firebase/firestore";

// import { onAuthStateChanged, sendEmailVerification, getAuth } from "firebase/auth"
// import ListPlayers from '../admin/ListPlayers';

export default function ProtectedRoute(props) {

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
            alert("An error occured while fetching user data");
        }
    };

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        // console.log(user)
        fetchUserDataDB();
        // fetchUserDataAUTH();
    }, [user, loading]);

    if (user.role === props.role) {
        return (
            <Route exact path={props.path}>
                {props.children}
            </Route>
        )
    } else {
        return navigate("/");
    }
}
