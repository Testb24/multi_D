// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCMTPrnhMT-RwdZMT9M6Cz4Dr8ottaQAac",
    authDomain: "ninjafunctiontuto.firebaseapp.com",
    projectId: "ninjafunctiontuto",
    storageBucket: "ninjafunctiontuto.appspot.com",
    messagingSenderId: "1094943604020",
    appId: "1:1094943604020:web:1087e437f2c2746a107961",
    measurementId: "G-RXJ8W7NW4S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


export { auth, db, app };