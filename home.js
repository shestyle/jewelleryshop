import { db } from "./firebase.js";
import { collection, getDocs } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const grid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");

let products = [];
let cart = [];

/* LOAD PRODUCTS */
async function loadProducts(){
  const snap = await getDocs(collection(db,"products"));
  snap.forEach(d => products.push({id:d.id,...d.data()}));
  render();
}

function render(){
  grid.innerHTML = "";
  products.forEach(p=>{
    grid.innerHTML += `
      <div class="card">
        <img src="${p.imageURL}">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <button onclick="addToCart('${p.id}')">🛒 Add to Cart</button>
      </div>
    `;
  });
}

window.addToCart = id => {
  cart.push(products.find(p=>p.id===id));
  cartCount.textContent = cart.length;
};

/* HERO SLIDER */
const slides = document.querySelectorAll(".hero-slide");
let i = 0;

setInterval(()=>{
  slides[i].classList.remove("active");
  i = (i + 1) % slides.length;
  slides[i].classList.add("active");
}, 4500);

loadProducts();
