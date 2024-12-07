// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyB7wG_VV1plQ8HFubZn1TAg6IPQz227cmg',
  authDomain: 'tripmeaway-58d43.firebaseapp.com',
  projectId: 'tripmeaway-58d43',
  storageBucket: 'tripmeaway-58d43.firebasestorage.app',
  messagingSenderId: '207759543760',
  appId: '1:207759543760:web:50ccced6d849f1f61c7dd5',
  measurementId: 'G-JWRGBC18ZE'
};

function initializeFirebase() {
  const firebaseApp = initializeApp(firebaseConfig);
  const firestore = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp);
  const analytics = getAnalytics(firebaseApp);
  return {
    firebaseApp,
    firestore,
    auth,
    analytics
  }
}

function connectToEmulators({ firebaseApp, auth, firestore, analytics }) {
  const isLocalhost = location.hostname === 'localhost';
  if (isLocalhost) {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(firestore, 'localhost', 8081);
  }

  return { firebaseApp, auth, firestore, analytics }
}

export function getFirebase(): ReturnType<typeof initializeFirebase> {
  const alreadyInitialized = getApps().length > 0;
  if (alreadyInitialized) {
    return initializeFirebase(); // idempotent
  }
  return connectToEmulators(initializeFirebase());
}