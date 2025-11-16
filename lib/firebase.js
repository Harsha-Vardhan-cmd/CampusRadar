import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDXQVd6FxFLspb-vzOS0QGj2YnTlRJfVg4",
  authDomain: "campus-radar.firebaseapp.com",
  projectId: "campus-radar",
  storageBucket: "campus-radar.firebasestorage.app",
  messagingSenderId: "440738377700",
  appId: "1:440738377700:web:bb2d31ac377996328961f1"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)