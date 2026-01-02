import { db } from "./firebase.js";
import { collection, getDocs } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const grid = document.getElementById("productGrid");
const cart = document.getElementById("cart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");

let products = [];
let cartData = [];

async function loadProducts(){
  const snap = await getDocs(collection(db,"products"));
  snap.forEach(d => products.push({id:d.id,...d.data()}));
  renderProducts();
}

function renderProducts(){
  grid.innerHTML="";
  products.forEach(p=>{
    grid.innerHTML+=`
      <div class="card">
        <img src="${p.imageURL}">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <button onclick="addToCart('${p.id}')">Add to Cart</button>
      </div>
    `;
  });
}

window.addToCart = id => {
  const p = products.find(x=>x.id===id);
  cartData.push(p);
  cartCount.textContent = cartData.length;
};

document.getElementById("cartBtn").onclick=()=>cart.classList.toggle("show");

document.getElementById("orderBtn").onclick=()=>{
  let msg="Hello, I want to order:%0A";
  cartData.forEach(p=>msg+=`• ${p.name} - ₹${p.price}%0A`);
  window.open(`https://wa.me/91XXXXXXXXXX?text=${msg}`);
};

document.getElementById("darkToggle").onclick=()=>{
  document.body.classList.toggle("dark");
};

loadProducts();
