<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Mana Cakes Kuppam - Home</title>
<link rel="stylesheet" href="style.css"/>
</head>
<body>

<!-- Navbar -->
<nav>
  <div class="brand">
    <div class="logo">🍰</div>
    <div>Mana Cakes Kuppam</div>
  </div>
  <div class="menu-toggle" onclick="toggleMenu()">☰</div>
  <ul id="navLinks">
    <li><a href="index.html" class="active">Home</a></li>
    <li><a href="menu.html">Menu</a></li>
    <li><a href="order.html">Order</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
  <div class="cart-icon" onclick="toggleCart()">🛒
    <span class="cart-badge" id="cartCount">0</span>
  </div>
</nav>

<!-- Featured Cakes -->
<section>
  <h2>Featured Cakes</h2>
  <div class="grid" id="cakesContainer"></div>
</section>

<!-- Cart Sidebar -->
<div class="cart-sidebar" id="cartSidebar">
  <h3>Your Cart</h3>
  <div id="cartItems"></div>
  <div class="cart-footer">
    <button class="btn-checkout" onclick="checkout()">Checkout</button>
  </div>
</div>

<!-- Admin Buttons -->
<div style="text-align:right; margin:10px;">
  <button onclick="adminLogin()">👨‍🍳 Owner Login</button>
  <button id="logoutBtn" style="display:none;" onclick="adminLogout()">Logout</button>
</div>

<!-- Add Cake Form -->
<div id="addCakeForm" style="display:none; padding:20px; border:1px solid #ccc; margin:20px; border-radius:8px;">
  <h3>Add New Cake</h3>
  <label>Cake Name:</label><br>
  <input type="text" id="cakeName"><br><br>
  <label>Cake Price (₹):</label><br>
  <input type="number" id="cakePrice"><br><br>
  <label>Upload Cake Image:</label><br>
  <input type="file" id="cakeImage" accept="image/*"><br><br>
  <button onclick="saveNewCake(true)">Save Permanent</button>
  <button onclick="saveNewCake(false)">Save Temporary</button>
  <button onclick="document.getElementById('addCakeForm').style.display='none'">Cancel</button>
</div>

<script src="script.js"></script>
<script>
  window.onload = () => {
    renderCakes();
    updateCartDisplay();
    if(localStorage.getItem("isAdmin")==="true") enableAdminUI();
  }
</script>
</body>
</html>
