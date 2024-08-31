import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';

const firebaseConfig = Constants.manifest.extra.firebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
