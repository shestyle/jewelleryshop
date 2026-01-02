if(localStorage.getItem("admin")!=="true"){location.href="admin-login.html";}
let products=JSON.parse(localStorage.getItem("products"))||[];
function render(){
const box=document.getElementById("adminProducts");box.innerHTML="";
products.forEach((p,i)=>{
box.innerHTML+=`<div class="product"><img src="${p.image}"><h3>${p.name}</h3><p>₹${p.price}</p><button onclick="del(${i})">Delete</button></div>`;
});
}
function addProduct(){
products.push({id:Date.now(),name:name.value,price:price.value,image:image.value});
localStorage.setItem("products",JSON.stringify(products));
render();
}
function del(i){products.splice(i,1);localStorage.setItem("products",JSON.stringify(products));render();}
render();
