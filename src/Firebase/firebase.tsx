import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  UserCredential,
  EmailAuthProvider,
  AuthCredential,
  EmailAuthCredential,
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
  onSnapshot,
  arrayUnion,
  deleteDoc,
  arrayRemove,
} from 'firebase/firestore';
import { Collections } from '../Constants/collections';
import * as geofire from 'geofire-common';
import { RADIUS_IN_M } from '../Constants/locatingParams';
import { BlockedUser } from '../Models/profile.models';

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

const doDeleteChat = async (docId: string): Promise<void> => {
  return deleteDoc(doc(db, Collections.Chats, docId));
};

const doDeleteProfile = async (docId: string): Promise<void> => {
  return deleteDoc(doc(db, Collections.Users, docId));
};

const doDeleteUser = async (): Promise<void | null> => {
  const user = auth.currentUser;
  return user ? deleteUser(user) : null;
};

const getCredential = (password: string): EmailAuthCredential | undefined => {
  if (!auth.currentUser?.email) {
    return;
  }
  const userEmail = auth.currentUser?.email;
  return EmailAuthProvider.credential(userEmail, password);
};

const doReauthenticate = async (credential: AuthCredential): Promise<UserCredential | undefined> => {
  if (!auth.currentUser || !credential) {
    return;
  }
  const user = auth.currentUser;
  return reauthenticateWithCredential(user, credential);
};

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
  arrayUnion,
  arrayRemove,
  orderBy,
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
  onSnapshot,
  doDeleteChat,
  doDeleteUser,
  doDeleteProfile,
  getCredential,
  doReauthenticate,
};
