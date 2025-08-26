// ---------------- Cart Logic ----------------
let cart = JSON.parse(localStorage.getItem("manaCart")) || [];
let cakes = JSON.parse(localStorage.getItem("cakesData")) || [];
let tempCakes = JSON.parse(sessionStorage.getItem("tempCakes")) || [];
let isAdmin = localStorage.getItem("isAdmin") === "true";
const whatsappNumber = "919441269096";

// ---------------- Cart Functions ----------------
function addToCart(name, price){
  let item = cart.find(c => c.name === name);
  if(item) item.qty++;
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

function saveCart(){ localStorage.setItem("manaCart", JSON.stringify(cart)); }

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
  } else { alert("Wrong password ❌"); }
}

function adminLogout(){
  isAdmin=false;
  localStorage.setItem("isAdmin","false");
  disableAdminUI();
  alert("Logged out");
}

// ---------------- Cake Functions ----------------
function saveNewCake(permanent=true){
  let name = document.getElementById("cakeName").value.trim();
  let price = parseFloat(document.getElementById("cakePrice").value);
  let file = document.getElementById("cakeImage");

  if(!name || isNaN(price)){ alert("Invalid details!"); return; }
  if(file.files.length===0){ alert("Select an image!"); return; }

  let reader = new FileReader();
  reader.onload = function(e){
    const newCake = {name, price, img:e.target.result};
    
    if(permanent){
      cakes.push(newCake);
      localStorage.setItem("cakesData", JSON.stringify(cakes));
    } else {
      tempCakes.push(newCake);
      sessionStorage.setItem("tempCakes", JSON.stringify(tempCakes));
    }

    renderCakes();
    document.getElementById("addCakeForm").style.display="none";
    document.getElementById("cakeName").value="";
    document.getElementById("cakePrice").value="";
    file.value="";
  }
  reader.readAsDataURL(file.files[0]);
}

function deleteCake(i){
  if(confirm("Delete this cake?")){
    if(i < cakes.length){
      cakes.splice(i,1);
      localStorage.setItem("cakesData", JSON.stringify(cakes));
    } else {
      tempCakes.splice(i - cakes.length,1);
      sessionStorage.setItem("tempCakes", JSON.stringify(tempCakes));
    }
    renderCakes();
  }
}

function renderCake(cake, index){
  let container = document.getElementById("cakesContainer");
  let card = document.createElement("div");
  card.className="card";
  card.innerHTML=`<img class="media" src="${cake.img}" alt="${cake.name}">
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

function renderCakes(){
  let container = document.getElementById("cakesContainer");
  container.innerHTML="";
  [...cakes,...tempCakes].forEach((c,i)=> renderCake(c,i));
  if(isAdmin){
    let add = document.createElement("div");
    add.className="add-card";
    add.textContent="+";
    add.onclick = ()=> document.getElementById("addCakeForm").style.display="block";
    container.appendChild(add);
  }
}

// ---------------- Navbar & Cart Toggle ----------------
function toggleMenu(){ document.getElementById("navLinks").classList.toggle("active"); }
function toggleCart(){ document.getElementById("cartSidebar").classList.toggle("active"); }

// ---------------- Init ----------------
window.onload = ()=>{
  renderCakes();
  updateCartDisplay();
  if(isAdmin) enableAdminUI();
}

function enableAdminUI(){ document.getElementById("logoutBtn").style.display="inline-block"; renderCakes(); }
function disableAdminUI(){ document.getElementById("logoutBtn").style.display="none"; renderCakes(); }
