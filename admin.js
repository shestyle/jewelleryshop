import { auth, db, storage } from "./firebase.js";
import { signInWithEmailAndPassword } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { ref, uploadBytes, getDownloadURL } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

import { collection, addDoc } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("Admin Logged In"))
    .catch(err => alert(err.message));
};

window.uploadProduct = async function () {
  const image = document.getElementById("image").files[0];
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  if (!image || !name || !price) {
    alert("Fill all fields");
    return;
  }

  const imageRef = ref(storage, `jewelry/${Date.now()}-${image.name}`);
  await uploadBytes(imageRef, image);
  const imageURL = await getDownloadURL(imageRef);

  await addDoc(collection(db, "products"), {
    name,
    price,
    imageURL
  });

  alert("Product Uploaded Successfully");
};
