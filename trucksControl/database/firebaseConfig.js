import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = Constants.expoConfig.extra.firebaseConfig; 
console.log('CONSTANTS',Constants.expoConfig.extra.firebaseConfig);


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const storage = getStorage(app);

export { auth, firestore };
