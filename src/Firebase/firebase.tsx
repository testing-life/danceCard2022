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
  doEmailSignIn,
  doPasswordReset,
  doEmailRegistration,
  doSignOut,
  addDoc,
  createUserWithEmailAndPassword,
};

// class Firebase {
//   private auth;
//   private firestore;
//   private firestoreRef: any;
//   private geofirestore: GeoFirestore;
//   public fieldValue: any;

//   constructor() {
//     app.initializeApp(firebaseConfig);
//     console.log('app', app);
//     this.auth = app.auth();
//     this.firestore = app.firestore();
//     this.firestore.settings({ experimentalForceLongPolling: true });
//     this.firestoreRef = app.firestore;
//     this.geofirestore = new GeoFirestore(this.firestore);
//     this.fieldValue = app.firestore.FieldValue;
//   }

//   doAnonymousSignIn = () => this.auth.signInAnonymously();
//   doEmailRegistration = (email: string, password: string) => this.auth.createUserWithEmailAndPassword(email, password);
//   doSignOut = () => this.auth.signOut();
//   onAuthStateChanged = (user: any) => this.auth.onAuthStateChanged(user);
//   doEmailSignIn = (email: string, password: string) => this.auth.signInWithEmailAndPassword(email, password);
//   getCurrentUser = () => this.auth.currentUser;
//   getUsers = (): GeoCollectionReference => this.geofirestore.collection(Collections.Users);
//   getChats = () => this.firestore.collection(Collections.Chats);
//   getGeoPoint = (latitude: number, longitude: number) => new this.firestoreRef.GeoPoint(latitude, longitude);
// }
// export default Firebase;

// // export const FirebaseContext = React.createContext<Firebase|null>(null)

// type FirebaseConsumer = {
//   firebase: Firebase;
// };
// type Props = {
//   firebase: Firebase | undefined;
// };

// export const FirebaseContext = React.createContext<any>(undefined);
