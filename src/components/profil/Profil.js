import React, { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../../config/functionFB";
import { query, collection, getDocs, where } from "firebase/firestore";
import M from 'materialize-css';
import { onAuthStateChanged, sendEmailVerification, getAuth } from "firebase/auth"

export default function Profil() {

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
            
            M.toast({ html:"An error occured while fetching user data11", displayLength: 4000 });
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
                // console.log(user)
                // console.log(user.emailVerified)
                // const uid = user.uid;
                setUserData(user)
            } else {
            }
        });
    }

    function checkMailAdress() {
        const auth = getAuth();
        sendEmailVerification(auth.currentUser)
            .then(() => {
                // Email verification sent!
                // ...
                console.log("vérif envoyée")
                M.toast({ html:"vérif envoyée", displayLength: 4000 });
            });
    }

    return (
        <div className="container">
            <h1>{data && data.pseudo !== "" ? data.pseudo : "Profil utilisateur"}</h1>

            {data && data !== {} &&
                <ul>
                    <li>{"Pseudo : " + data.pseudo}</li>
                    <li>{"Compte travian : " + data.compte}</li>
                    <li>{"Email : " + data.email}</li>
                    <li>{"Role/grade : " + data.role}</li>
                </ul>
            }

            {userData && userData !== {} &&
                <ul>
                    <li>{"Adresse mail vérifiée : " + userData.emailVerified.toString()}</li>
                </ul>
            }

            <button onClick={checkMailAdress}>Vérifier mon adresse mail</button>

        </div>
    )
}
