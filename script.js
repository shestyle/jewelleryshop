// index page script
// loads products.json, renders products, adds redirection to product.html?id=<id>
// retains add-to-cart in localStorage

const productsEl = document.getElementById('products');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search');
const cartCountEl = document.getElementById('cart-count');

let products = [];
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function updateCartCount(){ cartCountEl.textContent = cart.length; }
updateCartCount();

const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });

async function loadProducts(){
  try {
    const res = await fetch('products.json');
    if(!res.ok) throw new Error('Products not found');
    products = await res.json();
  } catch (e) {
    console.error('Failed to load products.json', e);
    products = [];
  }
  populateCategories();
  renderProducts(products);
}

function populateCategories(){
  // Reset but keep 'all'
  categoryFilter.querySelectorAll('option:not([value="all"])')?.forEach(opt=>opt.remove());
  const categories = Array.from(new Set(products.map(p=>p.category || 'Other')));
  categories.forEach(c=>{
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    categoryFilter.appendChild(opt);
  });
}

function renderProducts(list){
  productsEl.innerHTML = '';
  if(!list.length){ productsEl.innerHTML = '<p>No products found.</p>'; return }
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';

    card.innerHTML = `
      <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
      <div class="card-body">
        <a class="product-link" href="product.html?id=${encodeURIComponent(p.id)}"><h4>${escapeHtml(p.name)}</h4></a>
        <p>${escapeHtml(p.description)}</p>
        <div class="price">${currency.format(p.price)}</div>
        <div class="actions">
          <button class="btn view">View</button>
          <button class="btn secondary add">Add</button>
        </div>
      </div>
    `;

    const img = card.querySelector('img');
    img.onerror = () => {
      img.src = `https://via.placeholder.com/1200x900?text=${encodeURIComponent(p.name)}`;
    };
    // clicking image navigates to detail
    img.addEventListener('click', () => {
      location.href = `product.html?id=${encodeURIComponent(p.id)}`;
    });

    card.querySelector('.view').addEventListener('click', () => {
      location.href = `product.html?id=${encodeURIComponent(p.id)}`;
    });

    card.querySelector('.add').addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(p);
    });

    productsEl.appendChild(card);
  });
}

function addToCart(p){
  cart.push(p);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${p.name} added to cart.`);
}

// small toast
function showToast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position:'fixed', right:'1rem', bottom:'1rem',
    background:'#111', color:'#fff', padding:'0.6rem 0.9rem',
    borderRadius:'8px', boxShadow:'0 8px 26px rgba(0,0,0,0.2)', zIndex:1000, opacity:0, transition:'opacity .18s'
  });
  document.body.appendChild(t);
  requestAnimationFrame(()=>t.style.opacity=1);
  setTimeout(()=>{ t.style.opacity=0; setTimeout(()=>t.remove(),200) }, 1800);
}

document.getElementById('cart-btn').addEventListener('click', ()=>{
  if(!cart.length){ alert('Cart is empty'); return }
  const summary = cart.map((c,i)=>`${i+1}. ${c.name} — ${currency.format(c.price)}`).join('\n');
  alert(`Cart items:\n\n${summary}\n\nTotal: ${currency.format(cart.reduce((s,x)=>s+x.price,0))}`);
});

// filters
categoryFilter.addEventListener('change', applyFilters);
sortSelect.addEventListener('change', applyFilters);
searchInput.addEventListener('input', applyFilters);

function applyFilters(){
  const cat = categoryFilter.value;
  const sort = sortSelect.value;
  const q = (searchInput.value || '').trim().toLowerCase();
  let list = products.slice();
  if(cat !== 'all') list = list.filter(p=>p.category === cat);
  if(q) list = list.filter(p=>p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
  if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
  renderProducts(list);
}

document.getElementById('year').textContent = new Date().getFullYear();

// initial load
loadProducts();

function escapeHtml(str){
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
