import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig={
  apiKey:"YOUR_KEY",
  authDomain:"PROJECT.firebaseapp.com",
  projectId:"PROJECT",
  storageBucket:"PROJECT.appspot.com"
};

const app=initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const storage=getStorage(app);
