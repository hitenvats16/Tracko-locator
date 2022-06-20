import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBr0SlNAZQnZHmcfJHFDxNWFyMDY8Nb9-k",
  authDomain: "tracko-fd5c2.firebaseapp.com",
  projectId: "tracko-fd5c2",
  storageBucket: "tracko-fd5c2.appspot.com",
  messagingSenderId: "971378312906",
  appId: "1:971378312906:web:4308a55cf4bf798e361633",
  measurementId: "G-NWFFBRFFD4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db }