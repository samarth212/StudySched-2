// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAd_9PmOBsxqPfzzVQWuoa1-jWqeWD9reo",
    authDomain: "studysched2.firebaseapp.com",
    projectId: "studysched2",
    storageBucket: "studysched2.appspot.com",
    messagingSenderId: "148421664429",
    appId: "1:148421664429:web:21ad88be5e6427c253b024",
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
export { auth, provider, app };
