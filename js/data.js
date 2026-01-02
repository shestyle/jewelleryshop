let products=JSON.parse(localStorage.getItem("products"))||[
{id:1,name:"AI Bridal Necklace",price:2499,image:"https://images.unsplash.com/photo-1617038260897-41a1f14a8f7a"},
{id:2,name:"AI Korean Earrings",price:499,image:"https://images.unsplash.com/photo-1585386959984-a41552231692"}
];
localStorage.setItem("products",JSON.stringify(products));
const list=document.getElementById("productList");
products.forEach(p=>{
list.innerHTML+=`<div class="product"><img src="${p.image}"><h3>${p.name}</h3><p>₹${p.price}</p><button onclick="addToCart(${p.id})">Add</button></div>`;
});
