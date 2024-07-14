// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyAPq5nABnS6cf8nBEy1OJahTqnRWHcEWwI',
  authDomain: 'analytics-tracker-firebase.firebaseapp.com',
  projectId: 'analytics-tracker-firebase',
  storageBucket: 'analytics-tracker-firebase.appspot.com',
  messagingSenderId: '984499368535',
  appId: '1:984499368535:web:2c537e5761c27781176912',
  measurementId: 'G-DPL0SSSV2C'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
export const register = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
export const onUserStateChange = (callback) => {
  onAuthStateChanged(auth, callback);
};
export const logout = () => {
  return signOut(auth);
};
