import { auth, db, storage } from "./firebase.js";
import { signInWithEmailAndPassword } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { ref, uploadBytes, getDownloadURL } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { addDoc, collection } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.login = () => {
  signInWithEmailAndPassword(
    auth,
    email.value,
    password.value
  ).then(() => alert("Logged in"));
};

window.uploadProduct = async () => {
  const file = image.files[0];
  const imgRef = ref(storage, `jewelry/${Date.now()}`);
  await uploadBytes(imgRef, file);
  const url = await getDownloadURL(imgRef);

  await addDoc(collection(db,"products"),{
    name: name.value,
    price: price.value,
    category: category.value,
    imageURL: url
  });

  alert("Product uploaded");
};
