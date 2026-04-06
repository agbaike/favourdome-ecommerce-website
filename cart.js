/**
 * Cart Management System - Using localStorage
 * Handles add to cart, remove, update quantity, and cart persistence
 */

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", function () {
  loadCart();
  updateCartBadge();

  // Handle add to cart for single product page
  const addToCartBtn = document.getElementById("addToCartBtn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", addToCartFromProductPage);
  }

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", handleCheckout);
  }

  // Handle coupon functionality
  const couponBtn = document.getElementById("couponBtn");
  const couponInput = document.getElementById("couponInput");

  if (couponBtn && couponInput) {
    couponBtn.addEventListener("click", function () {
      const code = couponInput.value.trim();
      if (code) {
        applyCoupon(code);
        couponInput.value = ""; // Clear input after applying
      } else {
        showCartNotification("Please enter a coupon code", "error");
      }
    });

    // Allow Enter key to apply coupon
    couponInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        couponBtn.click();
      }
    });
  }
});

// ===== CART OBJECT =====
const Cart = {
  items: [],
  appliedCoupon: null,

  load: function () {
    const saved = localStorage.getItem("cart");
    this.items = saved ? JSON.parse(saved) : [];
    const savedCoupon = localStorage.getItem("appliedCoupon");
    this.appliedCoupon = savedCoupon ? JSON.parse(savedCoupon) : null;
  },

  save: function () {
    localStorage.setItem("cart", JSON.stringify(this.items));
    if (this.appliedCoupon) {
      localStorage.setItem("appliedCoupon", JSON.stringify(this.appliedCoupon));
    } else {
      localStorage.removeItem("appliedCoupon");
    }
  },

  add: function (product) {
    // Check if product already in cart
    const existingItem = this.items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      product.quantity = product.quantity || 1;
      this.items.push(product);
    }

    this.save();
    updateCartBadge();
    showCartNotification(`${product.name} added to cart!`);
  },

  remove: function (productId) {
    this.items = this.items.filter((item) => item.id !== productId);
    this.save();
    updateCartBadge();
  },

  updateQuantity: function (productId, quantity) {
    const item = this.items.find((item) => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      if (item.quantity === 0) {
        this.remove(productId);
      } else {
        this.save();
      }
    }
  },

  getTotal: function () {
    return this.items.reduce((total, item) => {
      const price =
        typeof item.price === "string"
          ? parseFloat(item.price.replace("$", ""))
          : item.price;
      return total + price * item.quantity;
    }, 0);
  },

  getCount: function () {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  },

  clear: function () {
    this.items = [];
    this.appliedCoupon = null;
    this.save();
    updateCartBadge();
  },
};

// ===== COUPON SYSTEM =====
const Coupons = {
  // Available coupons with their discount rules
  available: {
    SAVE10: {
      type: "percentage",
      value: 10,
      minPurchase: 0,
      description: "10% off entire order",
    },
    SAVE20: {
      type: "percentage",
      value: 20,
      minPurchase: 100,
      description: "20% off orders over $100",
    },
    FIXED50: {
      type: "fixed",
      value: 50,
      minPurchase: 200,
      description: "$50 off orders over $200",
    },
    WELCOME: {
      type: "percentage",
      value: 15,
      minPurchase: 0,
      description: "15% off for new customers",
    },
  },

  validate: function (code, subtotal) {
    const coupon = this.available[code.toUpperCase()];
    if (!coupon) {
      return { valid: false, message: "Invalid coupon code" };
    }

    if (subtotal < coupon.minPurchase) {
      return {
        valid: false,
        message: `Minimum purchase of $${coupon.minPurchase} required for this coupon`,
      };
    }

    return { valid: true, coupon: coupon };
  },

  calculateDiscount: function (coupon, subtotal) {
    if (coupon.type === "percentage") {
      return subtotal * (coupon.value / 100);
    } else if (coupon.type === "fixed") {
      return Math.min(coupon.value, subtotal);
    }
    return 0;
  },
};

// ===== COUPON FUNCTIONS =====
function applyCoupon(code) {
  Cart.load();
  const subtotal = Cart.getTotal();

  if (subtotal === 0) {
    showCartNotification("Add items to cart before applying coupon", "error");
    return;
  }

  const validation = Coupons.validate(code, subtotal);
  if (!validation.valid) {
    showCartNotification(validation.message, "error");
    return;
  }

  Cart.appliedCoupon = {
    code: code.toUpperCase(),
    ...validation.coupon,
  };
  Cart.save();

  updateCartTotals();
  updateCouponStatus();
  showCartNotification(
    `Coupon "${code.toUpperCase()}" applied! ${validation.coupon.description}`,
    "success",
  );
}

function removeCoupon() {
  Cart.appliedCoupon = null;
  Cart.save();
  updateCartTotals();
  updateCouponStatus();
  showCartNotification("Coupon removed", "success");
}

function updateCouponStatus() {
  const statusDiv = document.getElementById("couponStatus");
  if (!statusDiv) return;

  if (Cart.appliedCoupon) {
    statusDiv.innerHTML = `
      <div style="background-color: #d4edda; color: #155724; padding: 8px; border-radius: 4px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
        <span><strong>${Cart.appliedCoupon.code}</strong> applied: ${Cart.appliedCoupon.description}</span>
        <button onclick="removeCoupon()" style="background: none; border: none; color: #155724; cursor: pointer; font-size: 16px;">&times;</button>
      </div>
    `;
  } else {
    statusDiv.innerHTML = "";
  }
}

// ===== PUBLIC FUNCTIONS =====
function loadCart() {
  Cart.load();
}

function addToCart(productId, productName, price, quantity = 1, image) {
  const product = {
    id: productId,
    name: productName,
    price: price,
    quantity: quantity,
    image: image || "images/placeholder.jpg",
  };

  Cart.add(product);
}

function removeFromCart(productId) {
  Cart.remove(productId);
  renderCartPage();
}

function updateQuantityInCart(productId, quantity) {
  const qty = parseInt(quantity);
  if (qty <= 0) {
    Cart.remove(productId);
  } else {
    Cart.updateQuantity(productId, qty);
  }
  renderCartPage();
}

function addToCartFromProductPage() {
  // Get product details from page
  const productName =
    document.querySelector("#productName")?.textContent || "Product";
  const priceText =
    document.querySelector("#productPrice")?.textContent || "$0.00";
  const price = parseFloat(priceText.replace("$", ""));
  const quantityInput = document.querySelector("#quantityInput");
  const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
  const imageUrl =
    document.getElementById("Mainimg")?.src || "images/placeholder.jpg";

  // Generate product ID from name
  const productId =
    "product_" + productName.toLowerCase().replace(/[^a-z0-9]/g, "_");

  addToCart(productId, productName, price, quantity, imageUrl);
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  const count = Cart.getCount();

  // Create badge if it doesn't exist
  if (!badge && document.getElementById("lg-bag")) {
    const newBadge = document.createElement("span");
    newBadge.id = "cartBadge";
    newBadge.style.cssText = `
      position: absolute;
      top: -5px;
      right: -10px;
      background-color: #ff6b6b;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    `;

    const cartLink = document.getElementById("lg-bag");
    cartLink.style.position = "relative";
    cartLink.appendChild(newBadge);
  }

  // Update badge text
  const updatedBadge = document.getElementById("cartBadge");
  if (updatedBadge) {
    updatedBadge.textContent = count;
    updatedBadge.style.display = count > 0 ? "flex" : "none";
  }
}

function renderCartPage() {
  const cartTable = document.querySelector("#cart tbody, #cart table tbody");
  if (!cartTable) return;

  // Clear existing rows (but keep header)
  const rows = cartTable.querySelectorAll("tbody tr");
  rows.forEach((row) => row.remove());

  Cart.load();

  if (Cart.items.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML =
      '<td colspan="6" style="text-align: center; padding: 20px;">Your cart is empty. <a href="shop.html">Continue shopping</a></td>';
    cartTable.appendChild(emptyRow);
  } else {
    Cart.items.forEach((item) => {
      const price =
        typeof item.price === "string"
          ? parseFloat(item.price.replace("$", ""))
          : item.price;
      const subtotal = price * item.quantity;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><a href="#" onclick="removeFromCart('${item.id}'); return false;"><i class="far fa-times-circle"></i></a></td>
        <td><img src="${item.image || "images/placeholder.jpg"}" alt="${item.name}" style="width: 50px;"></td>
        <td>${item.name}</td>
        <td>$${price.toFixed(2)}</td>
        <td><input type="number" min="1" value="${item.quantity}" onchange="updateQuantityInCart('${item.id}', this.value)"></td>
        <td>$${subtotal.toFixed(2)}</td>
      `;
      cartTable.appendChild(row);
    });
  }

  // Update totals
  updateCartTotals();
  updateCouponStatus();
}

function updateCartTotals() {
  const subtotalTable = document.querySelector("#Subtotal table");
  if (!subtotalTable) return;

  Cart.load();
  const subtotal = Cart.getTotal();
  const shipping = 0; // Free shipping
  let discount = 0;
  let discountRow = null;
  let totalRow = null;

  // Clear existing discount row if any
  const existingDiscountRow = subtotalTable.querySelector(".discount-row");
  if (existingDiscountRow) {
    existingDiscountRow.remove();
  }

  // Calculate discount if coupon is applied
  if (Cart.appliedCoupon) {
    discount = Coupons.calculateDiscount(Cart.appliedCoupon, subtotal);

    // Add discount row
    discountRow = document.createElement("tr");
    discountRow.className = "discount-row";
    discountRow.innerHTML = `
      <td>Discount (${Cart.appliedCoupon.code})</td>
      <td>-$${discount.toFixed(2)}</td>
    `;

    // Insert discount row before total
    const shippingRow = subtotalTable.querySelector("tr:nth-child(2)");
    if (shippingRow) {
      shippingRow.insertAdjacentElement("afterend", discountRow);
    }
  }

  const total = subtotal + shipping - discount;

  // Update existing cells
  const subtotalCell = subtotalTable.querySelector(
    "tr:first-child td:last-child",
  );
  const totalCell = subtotalTable.querySelector("tr:last-child td:last-child");

  if (subtotalCell) {
    subtotalCell.textContent = `$${subtotal.toFixed(2)}`;
  }

  if (totalCell) {
    totalCell.innerHTML = `<strong>$${total.toFixed(2)}</strong>`;
  }
}

// If on cart page, render on load
if (document.getElementById("cart")) {
  document.addEventListener("DOMContentLoaded", function () {
    renderCartPage();
    updateCouponStatus();
  });
}

// ===== UTILITY FUNCTIONS =====
function handleCheckout(event) {
  event.preventDefault();
  Cart.load();

  if (Cart.items.length === 0) {
    showCartNotification(
      "Your cart is empty. Add items before checkout.",
      "error",
    );
    return;
  }

  // Redirect to checkout page instead of processing order here
  window.location.href = "checkout.html";
}

function showCartNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: ${type === "success" ? "#28a745" : "#dc3545"};
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Animation styles
if (!document.querySelector("style[data-cart-animation]")) {
  const style = document.createElement("style");
  style.setAttribute("data-cart-animation", "true");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
