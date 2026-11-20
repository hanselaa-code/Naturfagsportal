import { getApps, initializeApp, type FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig: FirebaseOptions = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ??
    'AIzaSyBHnOekOWwpL1mFLPztG7MUHP9PiSz2tO8',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ??
    'naturportal-23cba.firebaseapp.com',
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'naturportal-23cba',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ??
    'naturportal-23cba.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '865504908477',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ??
    '1:865504908477:web:2a648765973e51066113d4',
  measurementId:
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? 'G-4CTSGSEGYK',
};

export const firebaseApp =
  getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
