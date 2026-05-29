// cart.js (Continued - Replace or append these sections to your existing code)

/**
 * Generates an incremented, formatted order confirmation string
 * Starts at "000 000 001" and increments by 1 with each purchase
 */
function generateOrderConfirmationNumber() {
  // Retrieve the next number from storage or default to 1 if it's the first order
  let nextOrderNum = parseInt(localStorage.getItem("slopeStyleOrderCount")) || 1;
  
  // Convert number to string and pad it with leading zeros to match 9 digits total
  let paddedNum = nextOrderNum.toString().padStart(9, '0');
  
  // Format the 9-digit string into chunks of three: "000 000 001"
  let formattedNum = `${paddedNum.substring(0, 3)} ${paddedNum.substring(3, 6)} ${paddedNum.substring(6, 9)}`;
  
  // Increment the counter and save it back to localStorage for the next purchase
  localStorage.setItem("slopeStyleOrderCount", nextOrderNum + 1);
  
  return formattedNum;
}

/**
 * Validates all checkout input fields and processes the order placement
 */
function placeOrder() {
  // Select all form element nodes from the DOM
  const firstName = document.getElementById("billing-first-name");
  const lastName = document.getElementById("billing-last-name");
  const email = document.getElementById("billing-email");
  const address = document.getElementById("shipping-address");
  const cardNum = document.getElementById("card-number");
  const cardCvv = document.getElementById("card-cvv");
  const cardExpiry = document.getElementById("card-expiry");
  const cardName = document.getElementById("card-name");

  // Verify all DOM inputs exist and strip surrounding whitespace to ensure real values
  if (!firstName?.value.trim() || 
      !lastName?.value.trim() || 
      !email?.value.trim() || 
      !address?.value.trim() || 
      !cardNum?.value.trim() || 
      !cardCvv?.value.trim() || 
      !cardExpiry?.value.trim() || 
      !cardName?.value.trim()) {
    
    alert("Please fill out all missing details before submitting your order.");
    return; // Halt execution early so order cannot be processed
  }

  // Generate the sequential sequential ID tag
  const confirmationNumber = generateOrderConfirmationNumber();

  // Show the requested completion alert window
  alert(`Thank you for your order!\nYour order confirmation number is: ${confirmationNumber}`);

  // Clear all text input spaces across the form fields
  [firstName, lastName, email, address, cardNum, cardCvv, cardExpiry, cardName].forEach(input => {
    if (input) input.value = "";
  });

  // Empty out active items arrays and reset storage nodes
  cart = [];
  saveCart();
  showMainShop();
}

/**
 * Injects the complete input markup directly into the shipping form if missing from the HTML template
 */
function ensureCheckoutFieldsExist() {
  const formContainer = document.getElementById("shipping-form");
  if (!formContainer) return;

  // Only inject if fields do not exist yet in the document markup
  if (!document.getElementById("billing-first-name")) {
    formContainer.innerHTML = `
      <div class="checkout-form-grid" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
        <h3>Customer & Shipping Details</h3>
        <div style="display: flex; gap: 10px;">
          <input type="text" id="billing-first-name" placeholder="First Name" style="flex: 1; padding: 8px;">
          <input type="text" id="billing-last-name" placeholder="Last Name" style="flex: 1; padding: 8px;">
        </div>
        <input type="email" id="billing-email" placeholder="Email Address" style="padding: 8px;">
        <input type="text" id="shipping-address" placeholder="Full Delivery Address" style="padding: 8px;">
        
        <h3 style="margin-top: 10px;">Payment Information</h3>
        <input type="text" id="card-name" placeholder="Name on Card" style="padding: 8px;">
        <input type="text" id="card-number" placeholder="Credit Card Number" style="padding: 8px;" maxlength="16">
        <div style="display: flex; gap: 10px;">
          <input type="text" id="card-expiry" placeholder="MM/YY" style="flex: 1; padding: 8px;" maxlength="5">
          <input type="text" id="card-cvv" placeholder="CVV" style="flex: 1; padding: 8px;" maxlength="4">
        </div>
      </div>
      <button onclick="placeOrder()" class="submit-order-btn" style="padding: 12px; width: 100%; cursor: pointer;">PLACE ORDER</button>
    `;
  }
}

// Intercept your DOM loaded routine to verify form placement logic loops
document.addEventListener("DOMContentLoaded", () => {
  renderShop();
  updateCartUI();
  checkUrlForCartRequest();
  ensureCheckoutFieldsExist(); // Inject form elements gracefully if missing
});

<!-- Inside your #checkout-page element -->
<div id="shipping-form">
  <input type="text" id="billing-first-name">
  <input type="text" id="billing-last-name">
  <input type="email" id="billing-email">
  <input type="text" id="shipping-address">
  
  <input type="text" id="card-name">
  <input type="text" id="card-number">
  <input type="text" id="card-expiry">
  <input type="text" id="card-cvv">
  
  <button onclick="placeOrder()">PLACE ORDER</button>
</div>
