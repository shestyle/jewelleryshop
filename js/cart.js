let cart=JSON.parse(localStorage.getItem("cart"))||[];
function addToCart(id){cart.push(id);localStorage.setItem("cart",JSON.stringify(cart));alert("Added")}
const box=document.getElementById("cartItems");
if(box){
let products=JSON.parse(localStorage.getItem("products"));
cart.forEach(id=>{
let p=products.find(x=>x.id===id);
box.innerHTML+=`<p>${p.name} - ₹${p.price}</p>`;
});
}
function payRazorpay(){
var options={key:"rzp_test_xxxxx",amount:50000,currency:"INR",name:"Shestyle"};
var rzp=new Razorpay(options);rzp.open();
}
function cashOnDelivery(){alert("Order placed with Cash on Delivery")}
