// cart.js
const inventory = [
  {
    id: 1,
    name: "Powder Twin Tip",
    desc: "The ultimate powder weapon for 2026. Rebuilt for maximum float and stability.",
    price: 799.99,
    sizes: ["179", "186", "191"],
    img: "4.png",
    images: ["5.png", "9.png"],
  },
  {
    id: 2,
    name: "Racer twin tip",
    desc: "A brand new technical outer layer designed for the harshest alpine conditions.",
    price: 799.99,
    sizes: ["179", "186", "191"],
    img: "1.png",
    images: ["1.png", "2.png"],
  },
  {
    id: 3,
    name: "The care package",
    desc: "Everything you need for a full season in the back country.",
    price: 899.99,
    sizes: ["179", "186", "191"],
    img: "ski.jpg",
    images: ["ski.jpg", "ski.jpg"],
  },
  {
    id: 4,
    name: "Carbon poles",
    desc: "Lightweight, high-strength carbon fiber for elite performance.",
    price: 135.0,
    sizes: ["S", "M", "L", "XL"],
    img: "ski.jpg",
    images: ["ski.jpg", "ski.jpg"],
  },
];

let cart = JSON.parse(localStorage.getItem("slopeStyleCart")) || [];
let activeProduct = null;
let selectedSize = "";

function saveCart() {
  localStorage.setItem("slopeStyleCart", JSON.stringify(cart));
  updateCartUI();
}

function renderShop() {
  const container = document.getElementById("shop-rows-container");
  if (!container) return; // Safely skip if not on the shop page

  container.innerHTML = inventory
    .map((p, index) => {
      const isEven = index % 2 === 0;
      const direction = isEven
        ? "flex-direction: row-reverse"
        : "flex-direction: row";
      return `
        <section class="shop-section" style="${direction};">
            <div class="shop-text">
                <h2>${p.name}</h2><div class="series-tag">2026 SERIES</div>
                <div class="shop-price">$${p.price.toFixed(2)}</div>
                <p>${p.desc}</p>
                <button onclick="openProduct(${p.id})" class="view-details-btn">VIEW DETAILS</button>
            </div>
            <div class="shop-img-container"><img src="${p.img}" class="product-preview-img"></div>
        </section>`;
    })
    .join("");
}

function openProduct(id) {
  activeProduct = inventory.find((p) => p.id === id);
  selectedSize = "";
  if (document.getElementById("main-shop"))
    document.getElementById("main-shop").style.display = "none";
  if (document.getElementById("checkout-page"))
    document.getElementById("checkout-page").style.display = "none";
  if (document.getElementById("product-page"))
    document.getElementById("product-page").style.display = "grid";

  document.getElementById("p-name").innerText = activeProduct.name;
  document.getElementById("p-price").innerText =
    `$${activeProduct.price.toFixed(2)}`;
  document.getElementById("p-desc").innerText = activeProduct.desc;
  document.getElementById("size-list").innerHTML = activeProduct.sizes
    .map(
      (s) =>
        `<button onclick="selectSize('${s}', this)" class="size-btn">${s}</button>`,
    )
    .join("");
  document.getElementById("p-gallery").innerHTML = activeProduct.images
    .map((img) => `<img src="${img}" class="gallery-img">`)
    .join("");
  window.scrollTo(0, 0);
}

function selectSize(size, btn) {
  selectedSize = size;
  document
    .querySelectorAll(".size-btn")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");
}

function addToCart() {
  if (!selectedSize) {
    document.getElementById("size-modal").style.display = "flex";
    return;
  }
  cart.push({ ...activeProduct, size: selectedSize });
  saveCart();
  document.getElementById("success-modal").style.display = "flex";
}

function updateCartUI() {
  // Update the badge count if it exists on the current page
  const badge = document.getElementById("cart-count-badge");
  if (badge) badge.innerText = cart.length;

  // Update the checkout side panels if they exist on the current page
  const summary = document.getElementById("summary-items");
  if (!summary) return;

  const grouped = cart.reduce((acc, i) => {
    const key = `${i.id}-${i.size}`;
    if (!acc[key]) acc[key] = { ...i, qty: 1 };
    else acc[key].qty++;
    return acc;
  }, {});

  summary.innerHTML = Object.values(grouped)
    .map(
      (i) => `
        <div class="summary-item">
            <div class="item-left">
                <span class="item-name-box">${i.name} (${i.size})</span>
                <span class="qty-tag">QTY: ${i.qty}</span>
                <button class="remove-btn" onclick="removeItemByOne(${i.id}, '${i.size}')">REMOVE</button>
            </div>
            <span>$${(i.price * i.qty).toFixed(2)}</span>
        </div>`,
    )
    .join("");

  const sub = cart.reduce((s, i) => s + i.price, 0).toFixed(2);
  if (document.getElementById("summary-total")) {
    document.getElementById("summary-total").innerHTML =
      `<small>SUBTOTAL:</small> $${sub}`;
  }
}

function removeItemByOne(id, size) {
  const idx = cart.findIndex((i) => i.id == id && i.size == size);
  if (idx !== -1) {
    cart.splice(idx, 1);
    saveCart();
    if (cart.length === 0 && document.getElementById("main-shop"))
      showMainShop();
  }
}

function viewCartAndClose() {
  closeModal("success-modal");
  showCheckout();
}
defineGlobalCloseModal = function (id) {
  document.getElementById(id).style.display = "none";
};
window.closeModal = defineGlobalCloseModal;

function showCheckout() {
  if (cart.length === 0) {
    document.getElementById("empty-cart-modal").style.display = "flex";
    return;
  }
  if (document.getElementById("main-shop"))
    document.getElementById("main-shop").style.display = "none";
  if (document.getElementById("product-page"))
    document.getElementById("product-page").style.display = "none";
  if (document.getElementById("checkout-page"))
    document.getElementById("checkout-page").style.display = "block";
  updateCartUI();
}
function revealShippingForm() {
  document.getElementById("shipping-form").style.display = "block";
}
function showMainShop() {
  if (document.getElementById("product-page"))
    document.getElementById("product-page").style.display = "none";
  if (document.getElementById("checkout-page"))
    document.getElementById("checkout-page").style.display = "none";
  if (document.getElementById("main-shop"))
    document.getElementById("main-shop").style.display = "block";
}
function closeEmptyModal() {
  closeModal("empty-cart-modal");
  showMainShop();
}
function placeOrder() {
  alert("Order placed!");
  cart = [];
  saveCart();
  showMainShop();
}

// Fire initial functions automatically when any page loads
document.addEventListener("DOMContentLoaded", () => {
  renderShop();
  updateCartUI();
  checkUrlForCartRequest();
});

function checkUrlForCartRequest() {
  // If the URL contains '#open-cart' and the checkout panel exists on this page
  if (
    window.location.hash === "#open-cart" &&
    document.getElementById("checkout-page")
  ) {
    // Clear the hash tag quietly so it doesn't break future page refreshes
    history.replaceState(
      "",
      document.title,
      window.location.pathname + window.location.search,
    );

    // Launch the internal view checkout function safely
    showCheckout();
  }
}
