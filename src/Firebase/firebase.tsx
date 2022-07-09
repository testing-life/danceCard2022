import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { getFirestore, query, getDocs, collection, where, addDoc } from 'firebase/firestore';
import { GeoFirestore, GeoCollectionReference } from 'geofirestore';
import { Collections } from '../Constants/collections';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_APP,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const doEmailSignIn = async (email: string, password: string) =>
  await signInWithEmailAndPassword(auth, email, password);

const doEmailRegistration = async (email: string, password: string) =>
  await createUserWithEmailAndPassword(auth, email, password);

const doPasswordReset = async (email: string) => await sendPasswordResetEmail(auth, email);

const doSignOut = async () => await signOut(auth);

export {
  auth,
  db,
  query,
  collection,
  doEmailSignIn,
  doPasswordReset,
  doEmailRegistration,
  doSignOut,
  addDoc,
  createUserWithEmailAndPassword,
};

//   getCurrentUser = () => this.auth.currentUser;
//   getUsers = (): GeoCollectionReference => this.geofirestore.collection(Collections.Users);
//   getChats = () => this.firestore.collection(Collections.Chats);
//   getGeoPoint = (latitude: number, longitude: number) => new this.firestoreRef.GeoPoint(latitude, longitude);
// }
// export default Firebase;
