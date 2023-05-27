// Import the functions you need from the SDKs you need
import { initializeApp,firebase } from "firebase/app";

import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiAcjB27vfGr9Si4vAdOYjv2U8tH7k0-8",
  authDomain: "minbaktokenmetadata.firebaseapp.com",
  projectId: "minbaktokenmetadata",
  storageBucket: "minbaktokenmetadata.appspot.com",
  messagingSenderId: "271266039813",
  appId: "1:271266039813:web:40ba0c030b5677f63f346c",
  measurementId: "G-VQX0SBH098"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
export {
  app,
  storage,
  db,
};