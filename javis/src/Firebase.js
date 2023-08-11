// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtXa3CxKyISMIHbq_lgpd8xKNhBoifzMQ",
  authDomain: "apicontroller-29142.firebaseapp.com",
  projectId: "apicontroller-29142",
  storageBucket: "apicontroller-29142.appspot.com",
  messagingSenderId: "898710858467",
  appId: "1:898710858467:web:7e0cd778d16c8d3a29b3d6",
  measurementId: "G-JLM4SXTLR9"
};

// Initialize Firebase
const app = !getApp().length?initializeApp(firebaseConfig) : getApp()
export const storage = getStorage()
export default app;
