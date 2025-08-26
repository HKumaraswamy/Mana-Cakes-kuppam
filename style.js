// --- Cart Logic Shared for index.html and order.html ---
let cart = [];

// Load cart from localStorage
if(localStorage.getItem("manaCart")){
  cart = JSON.parse(localStorage.getItem("manaCart"));
  updateCartDisplay();
}

function addToCart(name, price){
  let item = cart.find(c => c.name===name);
  if(item){ item.qty++; } 
  else { cart.push({name, price, qty:1}); }
  saveCart();
  updateCartDisplay();
}

function removeItem(index){
  cart.splice(index,1);
  saveCart();
  updateCartDisplay();
}

function updateCartDisplay(){
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  if(!cartItems || !cartCount) return; // Only for index.html

  cartItems.innerHTML = "";
  let totalItems = 0;
  cart.forEach((item,i)=>{
    totalItems += item.qty;
    cartItems.innerHTML += `
      <div class="cart-item">
        <span>${item.name} x${item.qty}</span>
        <span>₹${item.price*item.qty} 
          <button onclick="removeItem(${i})">❌</button>
        </span>
      </div>`;
  });
  cartCount.textContent = totalItems;
}

function checkout(){
  if(cart.length===0){ alert("Your cart is empty!"); return; }
  const orderUrl = "order.html?items=" + encodeURIComponent(JSON.stringify(cart));
  window.location.href = orderUrl;
}

function buyNow(name, price){
  const singleItem = [{name, price, qty:1}];
  const orderUrl = "order.html?items=" + encodeURIComponent(JSON.stringify(singleItem));
  window.location.href = orderUrl;
}

// Save cart to localStorage
function saveCart(){
  localStorage.setItem("manaCart", JSON.stringify(cart));
}

// Toggle Navbar Menu
function toggleMenu(){
  const nav = document.getElementById("navLinks");
  if(nav) nav.classList.toggle("active");
}

// Toggle Cart Sidebar
function toggleCart(){
  const sidebar = document.getElementById("cartSidebar");
  if(sidebar) sidebar.classList.toggle("active");
}
