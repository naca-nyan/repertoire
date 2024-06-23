// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, TwitterAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDv2k8ZKmMEZeekgd_YGzCmVo1sIzGeglg",
  authDomain: "syncroom-repertoire.web.app",
  databaseURL:
    "https://syncroom-repertoire-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "syncroom-repertoire",
  storageBucket: "syncroom-repertoire.appspot.com",
  messagingSenderId: "993193622593",
  appId: "1:993193622593:web:1df1ee2533be1fb8c95ac0",
  measurementId: "G-7TPE4EQ5QL",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth();
auth.languageCode = "ja";
export const provider = new TwitterAuthProvider();
export const database = getDatabase();
