<script>
// ---------------- Cart Logic (Shared) ----------------
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

// ---------------- Admin & Shared Cake Logic ----------------
let cakes = [];
let isAdmin = localStorage.getItem("isAdmin") === "true";

// JSONBin.io Config
const BIN_ID = "68ad9640b0e23b3c068fc080";  // Account Bin ID
const API_KEY = "$2a$10$qHD76TLbOL4GHnUhRFkj5ex0XAjZVH7P4KMCWvx43okgyZr5TtR3y"; // Master Key
const BASE_URL = "https://api.jsonbin.io/v3/b";

// Admin Login
function adminLogin(){
  let pass=prompt("Enter Owner Password:");
  if(pass==="kuppam123"){ 
    isAdmin=true;
    localStorage.setItem("isAdmin","true");
    enableAdminUI();
    alert("Admin mode ON ✅");
  } else { alert("Wrong password ❌"); }
}

function adminLogout(){
  isAdmin=false;
  localStorage.setItem("isAdmin","false");
  disableAdminUI();
  alert("Logged out");
}

function enableAdminUI(){
  document.getElementById("logoutBtn").style.display="inline-block";
  reRenderCakes();
}

function disableAdminUI(){
  document.getElementById("logoutBtn").style.display="none";
  reRenderCakes();
}

// Add New Cake
function saveNewCake(){
  let name=document.getElementById("cakeName").value;
  let price=document.getElementById("cakePrice").value;
  let file=document.getElementById("cakeImage");
  if(!name || !price || isNaN(price)){ alert("Invalid details!"); return; }
  if(file.files.length===0){ alert("Select image!"); return; }

  let reader=new FileReader();
  reader.onload=function(e){
    let newCake={name, price, img:e.target.result};
    cakes.push(newCake);
    saveCakesToServer();   // save to JSONBin
    document.getElementById("addCakeForm").style.display="none";
    document.getElementById("cakeName").value="";
    document.getElementById("cakePrice").value="";
    file.value="";
  }
  reader.readAsDataURL(file.files[0]);
}

// Render each cake
function renderCake(cake,index){
  let container=document.getElementById("cakesContainer");
  let card=document.createElement("div");
  card.className="card";
  card.innerHTML=`
    <img class="media" src="${cake.img}" alt="${cake.name}">
    <div class="pad">
      <h3>${cake.name}</h3>
      <div><span class="price">₹${cake.price}</span></div>
      <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap;">
        <button class="btn" onclick="addToCart('${cake.name}',${cake.price})">Add to Cart</button>
        <button class="btn secondary" onclick="buyNow('${cake.name}',${cake.price})">Buy Now</button>
        <button class="btn success" onclick="orderWhatsApp('${cake.name}',${cake.price})">📲 WhatsApp</button>
        ${isAdmin?`<button class="btn danger" onclick="deleteCake(${index})">❌ Delete</button>`:""}
      </div>
    </div>`;
  container.appendChild(card);
}

// Delete Cake
function deleteCake(i){
  if(confirm("Delete this cake?")){
    cakes.splice(i,1);
    saveCakesToServer();  // update server
  }
}

// Render all cakes
function reRenderCakes(){
  let container=document.getElementById("cakesContainer");
  container.innerHTML="";
  cakes.forEach((c,i)=>renderCake(c,i));
  if(isAdmin){
    let add=document.createElement("div");
    add.className="add-card";
    add.textContent="+";
    add.onclick=()=>document.getElementById("addCakeForm").style.display="block";
    container.appendChild(add);
  }
}

// ---------------- JSONBin.io Integration ----------------
async function loadCakesFromServer(){
  try{
    let res=await fetch(`${BASE_URL}/${BIN_ID}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    let data=await res.json();
    cakes=data.record || [];
    reRenderCakes();
  }catch(e){ console.error("Error loading cakes:",e); }
}

async function saveCakesToServer(){
  try{
    await fetch(`${BASE_URL}/${BIN_ID}`, {
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        "X-Master-Key": API_KEY
      },
      body:JSON.stringify(cakes)
    });
    reRenderCakes();
  }catch(e){ console.error("Error saving cakes:",e); }
}

// ----------- Init on Page Load -----------
window.onload=()=>{
  loadCakesFromServer();
  if(isAdmin) enableAdminUI();
}
</script>
