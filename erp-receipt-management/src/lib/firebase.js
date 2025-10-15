import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyBBVWIqTVlhuiSNZtEyBkr_IoeXNDpI1GM",
  authDomain: "erp--profile-automation.firebaseapp.com",
  databaseURL: "https://erp--profile-automation-default-rtdb.firebaseio.com",
  projectId: "erp--profile-automation",
  storageBucket: "erp--profile-automation.firebasestorage.app",
  messagingSenderId: "388570213169",
  appId: "1:388570213169:web:8eacbc8ea2acd2df171e10",
  measurementId: "G-E8D7Q4BV95",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)

// Initialize Analytics only on client side
let analytics
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)
}

export { analytics }

