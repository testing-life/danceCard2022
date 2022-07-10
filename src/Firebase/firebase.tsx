import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  orderBy,
  endAt,
  startAt,
  QueryDocumentSnapshot,
  QuerySnapshot,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { Collections } from '../Constants/collections';
import * as geofire from 'geofire-common';
import { RADIUS_IN_M } from '../Constants/locatingParams';

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

const getUsersInRadius = async (
  location: [lat: number, lng: number],
  radiusInM: number = RADIUS_IN_M,
): Promise<QueryDocumentSnapshot[]> => {
  const bounds: string[][] = geofire.geohashQueryBounds(location, radiusInM);
  const promises: Promise<QuerySnapshot>[] = [];
  const matchingDocs: QueryDocumentSnapshot[] = [];
  for (const b of bounds) {
    const q = query(collection(db, Collections.Users), orderBy('hash'), startAt(b[0]), endAt(b[1]));
    promises.push(getDocs(q));
  }
  const snapshots = await Promise.all(promises).catch((e: Error) => console.error(e));
  if (snapshots) {
    for (const snap of snapshots) {
      // console.log('snap.docs[0].data()', snap.docs[0].data());
      for (const doc of snap.docs) {
        const lat = doc.get('lat');
        const lng = doc.get('lng');
        const distanceInKm = geofire.distanceBetween([lat, lng], location);
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= radiusInM) {
          matchingDocs.push(doc);
        }
      }
    }
  }
  return matchingDocs;
};

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
  updateDoc,
  getDocs,
  where,
  doc,
  createUserWithEmailAndPassword,
  getUsersInRadius,
};

//   getCurrentUser = () => this.auth.currentUser;
//   getUsers = (): GeoCollectionReference => this.geofirestore.collection(Collections.Users);
//   getChats = () => this.firestore.collection(Collections.Chats);
//   getGeoPoint = (latitude: number, longitude: number) => new this.firestoreRef.GeoPoint(latitude, longitude);
// }
// export default Firebase;
