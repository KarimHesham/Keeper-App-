// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDRvY2_QsoSHGmpqB5WftTZIWbxfqM2BfY",
  authDomain: "netflix-clone-d3c51.firebaseapp.com",
  projectId: "netflix-clone-d3c51",
  storageBucket: "netflix-clone-d3c51.appspot.com",
  messagingSenderId: "930887277718",
  appId: "1:930887277718:web:3157af1fef0cad643db6b7",
  measurementId: "G-Z0LNNPBZRM",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

export { auth };
export default db;
