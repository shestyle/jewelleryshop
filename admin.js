import { db, storage } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const list=document.getElementById("adminList");

window.upload=async()=>{
  const file=image.files[0];
  const refImg=ref(storage,Date.now()+"");
  await uploadBytes(refImg,file);
  const url=await getDownloadURL(refImg);

  await addDoc(collection(db,"products"),{
    name:name.value,
    price:price.value,
    imageURL:url
  });
  load();
};

async function load(){
  list.innerHTML="";
  const snap=await getDocs(collection(db,"products"));
  snap.forEach(d=>{
    list.innerHTML+=`
      <div>
        ${d.data().name}
        <button onclick="del('${d.id}')">❌</button>
      </div>`;
  });
}

window.del=id=>deleteDoc(doc(db,"products",id)).then(load);
load();
