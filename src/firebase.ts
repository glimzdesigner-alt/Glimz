import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4mNtT2mUuhpY8G0sIfUwkHRWXkntTZAE",
  authDomain: "glimzcombr.firebaseapp.com",
  projectId: "glimzcombr",
  storageBucket: "glimzcombr.firebasestorage.app",
  messagingSenderId: "344498968945",
  appId: "1:344498968945:web:c228f2fce62d3ba549bed0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Email", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};
