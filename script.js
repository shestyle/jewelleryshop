// debug-script.js (replace your script.js temporarily)
const productsEl = document.getElementById('products');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search');
const cartCountEl = document.getElementById('cart-count');

let products = [];
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

function updateCartCount(){ if(cartCountEl) cartCountEl.textContent = cart.length; }
updateCartCount();

function showPageMessage(msg){
  if(productsEl) productsEl.innerHTML = `<p style="color:#7a6f63;padding:1rem">${msg}</p>`;
}

async function loadProducts(){
  // quick check for file protocol
  if(location.protocol === 'file:'){
    showPageMessage('It looks like you opened the page via file:// — please run a local server (see instructions in console).');
    console.error('Running via file:// will usually block fetch(). Start a simple server: python -m http.server 8000');
    return;
  }

  try {
    const res = await fetch('products.json', { cache: 'no-store' });
    if(!res.ok){
      showPageMessage(`Failed to load products.json (status ${res.status}). Check that products.json is in the project root and accessible.`);
      console.error('products.json fetch failed', res);
      return;
    }

    const text = await res.text();
    try {
      products = JSON.parse(text);
    } catch(parseErr){
      showPageMessage('products.json was loaded but contains invalid JSON. Check the file formatting (use JSONLint).');
      console.error('JSON parse error for products.json:', parseErr);
      console.error('products.json content preview:', text.slice(0,1200));
      return;
    }

    if(!Array.isArray(products) || products.length === 0){
      showPageMessage('products.json loaded but contains no products (empty array).');
      console.warn('products.json parsed to:', products);
      return;
    }

    // success — render
    populateCategories();
    renderProducts(products);
  } catch(err){
    showPageMessage('Error while loading products.json — see console for details.');
    console.error('Unexpected fetch error:', err);
  }
}

function populateCategories(){
  if(!categoryFilter) return;
  categoryFilter.querySelectorAll('option:not([value="all"])')?.forEach(opt=>opt.remove());
  const cats = Array.from(new Set(products.map(p => p.category || 'Other')));
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.textContent = c;
    categoryFilter.appendChild(opt);
  });
}

function renderProducts(list){
  if(!productsEl) return;
  productsEl.innerHTML = '';
  if(!list.length){ productsEl.innerHTML = '<p>No products found.</p>'; return; }
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${(p.name||'')}" loading="lazy" />
      <div class="card-body">
        <a class="product-link" href="product.html?id=${encodeURIComponent(p.id)}"><h4>${(p.name||'')}</h4></a>
        <p>${(p.description||'')}</p>
        <div class="price">${currency.format(p.price || 0)}</div>
        <div class="actions">
          <button class="btn view">View</button>
          <button class="btn secondary add">Add</button>
        </div>
      </div>
    `;
    const img = card.querySelector('img');
    img.onerror = () => {
      img.src = `https://via.placeholder.com/1200x900?text=${encodeURIComponent(p.name||'Product')}`;
    };
    img.addEventListener('click', () => location.href = `product.html?id=${encodeURIComponent(p.id)}`);
    card.querySelector('.view').addEventListener('click', () => location.href = `product.html?id=${encodeURIComponent(p.id)}`);
    card.querySelector('.add').addEventListener('click', (e) => { e.stopPropagation(); cart.push(p); localStorage.setItem('cart', JSON.stringify(cart)); updateCartCount(); alert(`${p.name} added to cart.`); });
    productsEl.appendChild(card);
  });
}

// attach filter handlers if present
categoryFilter?.addEventListener('change', applyFilters);
sortSelect?.addEventListener('change', applyFilters);
searchInput?.addEventListener('input', applyFilters);

function applyFilters(){
  const cat = categoryFilter?.value || 'all';
  const sort = sortSelect?.value || 'featured';
  const q = (searchInput?.value || '').trim().toLowerCase();
  let list = products.slice();
  if(cat !== 'all') list = list.filter(p=>p.category === cat);
  if(q) list = list.filter(p=> (p.name||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q));
  if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
  if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
  renderProducts(list);
}

document.getElementById('year')?.textContent = new Date().getFullYear();
document.getElementById('cart-btn')?.addEventListener('click', ()=> {
  if(!cart.length){ alert('Cart is empty'); return; }
  const summary = cart.map((c,i)=>`${i+1}. ${c.name} — ${currency.format(c.price)}`).join('\n');
  alert(`Cart items:\n\n${summary}\n\nTotal: ${currency.format(cart.reduce((s,x)=>s+(x.price||0),0))}`);
});

loadProducts();
