// ---------------- Cart Logic ----------------
let cart = JSON.parse(localStorage.getItem("manaCart")) || [];
let cakes = [];
let isAdmin = localStorage.getItem("isAdmin") === "true";

// JSONBin.io Config
const BIN_ID = "68ad9640b0e23b3c068fc080"; // replace with your bin ID
const API_KEY = "$2a$10$qHD76TLbOL4GHnUhRFkj5ex0XAjZVH7P4KMCWvx43okgyZr5TtR3y";
const BASE_URL = "https://api.jsonbin.io/v3/b";

// WhatsApp Number
const whatsappNumber = "919441269096";

// ---------------- Cart Functions ----------------
function addToCart(name, price) {
  let item = cart.find(c => c.name === name);
  if (item) item.qty++;
  else cart.push({name, price, qty:1});
  saveCart();
  updateCartDisplay();
}

function removeItem(i){
  cart.splice(i,1);
  saveCart();
  updateCartDisplay();
}

function updateCartDisplay(){
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  if(!cartItems || !cartCount) return;
  cartItems.innerHTML="";
  let total=0;
  cart.forEach((item,i)=>{
    total += item.qty;
    cartItems.innerHTML += `<div class="cart-item">
      <span>${item.name} x${item.qty}</span>
      <span>₹${item.price*item.qty} <button onclick="removeItem(${i})">❌</button></span>
    </div>`;
  });
  cartCount.textContent = total;
}

function saveCart(){
  localStorage.setItem("manaCart", JSON.stringify(cart));
}

function checkout(){
  if(cart.length===0){ alert("Cart empty!"); return; }
  window.location.href="order.html?items="+encodeURIComponent(JSON.stringify(cart));
}

function buyNow(name, price){
  const singleItem = [{name, price, qty:1}];
  window.location.href="order.html?items="+encodeURIComponent(singleItem);
}

function orderWhatsApp(name, price){
  const msg = `Hello! I want to order:\n- ${name} x1 = ₹${price}\nTotal: ₹${price}`;
  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,"_blank");
}

// ---------------- Admin Functions ----------------
function adminLogin(){
  let pass = prompt("Enter Owner Password:");
  if(pass==="jagath123"){
    isAdmin = true;
    localStorage.setItem("isAdmin","true");
    enableAdminUI();
    alert("Admin mode ON ✅");
  } else {
    alert("Wrong password ❌");
  }
}

function adminLogout(){
  isAdmin = false;
  localStorage.setItem("isAdmin","false");
  disableAdminUI();
  alert("Logged out");
}

function enableAdminUI(){
  document.getElementById("logoutBtn").style.display="inline-block";
  renderCakes();
}

function disableAdminUI(){
  document.getElementById("logoutBtn").style.display="none";
  renderCakes();
}

// ---------------- Cake Functions ----------------
function saveNewCake(){
  let name = document.getElementById("cakeName").value.trim();
  let price = parseFloat(document.getElementById("cakePrice").value);
  let file = document.getElementById("cakeImage");

  if(!name || isNaN(price)){
    alert("Invalid details!");
    return;
  }
  if(file.files.length===0){
    alert("Select an image!");
    return;
  }

  let reader = new FileReader();
  reader.onload = function(e){
    cakes.push({name, price, img: e.target.result});
    saveCakesToServer(); // Persist to JSONBin
    document.getElementById("addCakeForm").style.display="none";
    document.getElementById("cakeName").value="";
    document.getElementById("cakePrice").value="";
    file.value="";
  }
  reader.readAsDataURL(file.files[0]);
}

function renderCake(cake, index){
  let container = document.getElementById("cakesContainer");
  let card = document.createElement("div");
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

function deleteCake(i){
  if(confirm("Delete this cake?")){
    cakes.splice(i,1);
    saveCakesToServer(); // Persist deletion
  }
}

function renderCakes(){
  let container = document.getElementById("cakesContainer");
  container.innerHTML="";
  cakes.forEach((c,i)=> renderCake(c,i));

  if(isAdmin){
    let add = document.createElement("div");
    add.className="add-card";
    add.textContent="+";
    add.onclick = ()=> document.getElementById("addCakeForm").style.display="block";
    container.appendChild(add);
  }
}

// ---------------- JSONBin Functions ----------------
async function loadCakesFromServer(){
  try{
    let res = await fetch(`${BASE_URL}/${BIN_ID}/latest`, {
      headers: {"X-Master-Key": API_KEY}
    });
    let data = await res.json();
    cakes = data.record || [];
    renderCakes();
  }catch(e){ console.error("Error loading cakes:", e);}
}

async function saveCakesToServer(){
  try{
    await fetch(`${BASE_URL}/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type":"application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify(cakes)
    });
    renderCakes();
  }catch(e){ console.error("Error saving cakes:", e);}
}

// ---------------- Navbar & Cart Toggle ----------------
function toggleMenu(){ document.getElementById("navLinks").classList.toggle("active"); }
function toggleCart(){ document.getElementById("cartSidebar").classList.toggle("active"); }

// ---------------- Init ----------------
window.onload = ()=>{
  loadCakesFromServer();
  if(localStorage.getItem("isAdmin")==="true") enableAdminUI();
  updateCartDisplay();
}
