import { db } from "./firebase.js";
import { getDocs, collection } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const grid = document.getElementById("productGrid");
let allProducts = [];

async function loadProducts() {
  const snap = await getDocs(collection(db,"products"));
  snap.forEach(doc => allProducts.push(doc.data()));
  render(allProducts);
}

function render(list) {
  grid.innerHTML = "";
  list.forEach(p=>{
    grid.innerHTML += `
      <div class="card">
        <img src="${p.imageURL}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
      </div>
    `;
  });
}

window.filterProducts = c =>
  render(c==="all"?allProducts:allProducts.filter(p=>p.category===c));

loadProducts();

// hero animation
const slides=document.querySelectorAll(".hero-slide");
let i=0;
setInterval(()=>{
  slides[i].classList.remove("active");
  i=(i+1)%slides.length;
  slides[i].classList.add("active");
},4000);
