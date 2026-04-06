/**
 * Checkout Page Functionality
 * Handles order summary, form validation, and payment processing
 */

document.addEventListener("DOMContentLoaded", function () {
  // Check if cart has items
  if (!hasItemsInCart()) {
    showNotification("Your cart is empty. Redirecting to shop...", "error");
    setTimeout(() => {
      window.location.href = "shop.html";
    }, 2000);
    return;
  }

  // Initialize checkout page
  loadCheckoutData();
  setupFormValidation();
  setupPaymentMethodSwitching();
  setupShippingToggle();

  // Handle form submission
  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", handleOrderSubmission);
  }
});

function hasItemsInCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  return cart.length > 0;
}

function loadCheckoutData() {
  Cart.load();
  renderCheckoutItems();
  renderCheckoutTotals();
  updateCartBadge();
}

function renderCheckoutItems() {
  const checkoutItems = document.getElementById("checkoutItems");
  if (!checkoutItems) return;

  checkoutItems.innerHTML = "";

  Cart.items.forEach((item) => {
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace("$", ""))
        : item.price;
    const subtotal = price * item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className = "checkout-item";
    itemDiv.innerHTML = `
      <div class="item-image">
        <img src="${item.image || "images/placeholder.jpg"}" alt="${item.name}" />
      </div>
      <div class="item-details">
        <h4>${item.name}</h4>
        <p class="item-price">$${price.toFixed(2)}</p>
        <p class="item-quantity">Quantity: ${item.quantity}</p>
        <p class="item-subtotal"><strong>$${subtotal.toFixed(2)}</strong></p>
      </div>
    `;
    checkoutItems.appendChild(itemDiv);
  });
}

function renderCheckoutTotals() {
  const checkoutTotals = document.getElementById("checkoutTotals");
  if (!checkoutTotals) return;

  const subtotal = Cart.getTotal();
  const discount = Cart.appliedCoupon
    ? Coupons.calculateDiscount(Cart.appliedCoupon, subtotal)
    : 0;
  const shipping = 0; // Free shipping
  const total = subtotal - discount + shipping;

  checkoutTotals.innerHTML = `
    <div class="totals-row">
      <span>Subtotal:</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>
    ${
      discount > 0
        ? `
    <div class="totals-row discount-row">
      <span>Discount (${Cart.appliedCoupon.code}):</span>
      <span>-$${discount.toFixed(2)}</span>
    </div>
    `
        : ""
    }
    <div class="totals-row">
      <span>Shipping:</span>
      <span>${shipping === 0 ? "Free" : "$" + shipping.toFixed(2)}</span>
    </div>
    <div class="totals-row total-row">
      <span><strong>Total:</strong></span>
      <span><strong>$${total.toFixed(2)}</strong></span>
    </div>
  `;
}

function setupFormValidation() {
  // Card number formatting
  const cardNumberInput = document.getElementById("cardNumber");
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
      let formattedValue = value.replace(/(.{4})/g, "$1 ").trim();
      e.target.value = formattedValue;
    });
  }

  // Expiry date formatting
  const expiryInput = document.getElementById("expiryDate");
  if (expiryInput) {
    expiryInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length >= 2) {
        value = value.substring(0, 2) + "/" + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }

  // CVV validation
  const cvvInput = document.getElementById("cvv");
  if (cvvInput) {
    cvvInput.addEventListener("input", function (e) {
      e.target.value = e.target.value.replace(/\D/g, "").substring(0, 4);
    });
  }
}

function setupPaymentMethodSwitching() {
  const paymentMethods = document.querySelectorAll(
    'input[name="paymentMethod"]',
  );
  const cardSection = document.getElementById("cardPaymentSection");
  const paypalSection = document.getElementById("paypalSection");
  const bankSection = document.getElementById("bankSection");

  paymentMethods.forEach((method) => {
    method.addEventListener("change", function () {
      // Hide all payment sections
      [cardSection, paypalSection, bankSection].forEach((section) => {
        if (section) section.style.display = "none";
      });

      // Show selected payment section
      if (this.value === "card" && cardSection) {
        cardSection.style.display = "block";
      } else if (this.value === "paypal" && paypalSection) {
        paypalSection.style.display = "block";
      } else if (this.value === "bank" && bankSection) {
        bankSection.style.display = "block";
      }

      // Update required fields
      updateRequiredFields(this.value);
    });
  });
}

function updateRequiredFields(paymentMethod) {
  const cardFields = ["cardNumber", "expiryDate", "cvv", "cardName"];
  const paypalFields = [];
  const bankFields = [];

  // Remove required attribute from all card fields
  cardFields.forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) field.required = paymentMethod === "card";
  });
}

function setupShippingToggle() {
  const sameAsBillingCheckbox = document.getElementById("sameAsBilling");
  const shippingSection = document.getElementById("shippingSection");

  if (sameAsBillingCheckbox && shippingSection) {
    sameAsBillingCheckbox.addEventListener("change", function () {
      shippingSection.style.display = this.checked ? "none" : "block";

      // Toggle required attributes for shipping fields
      const shippingFields = [
        "shippingFirstName",
        "shippingLastName",
        "shippingAddress",
        "shippingCity",
        "shippingZipCode",
        "shippingCountry",
      ];

      shippingFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId);
        if (field) field.required = !this.checked;
      });
    });
  }
}

function handleOrderSubmission(event) {
  event.preventDefault();

  const form = event.target;
  if (!form.checkValidity()) {
    showNotification("Please fill in all required fields", "error");
    return;
  }

  // Show loading state
  const submitBtn = document.getElementById("placeOrderBtn");
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  submitBtn.disabled = true;

  // Simulate payment processing
  setTimeout(() => {
    processOrder(form)
      .then(() => {
        showNotification("Order placed successfully!", "success");
        setTimeout(() => {
          window.location.href = "order-confirmation.html";
        }, 1500);
      })
      .catch((error) => {
        showNotification(error, "error");
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
  }, 2000);
}

async function processOrder(form) {
  return new Promise((resolve, reject) => {
    try {
      // Validate payment method
      const paymentMethod = form.paymentMethod.value;
      if (paymentMethod === "card") {
        const cardValidation = validateCardDetails(form);
        if (!cardValidation.valid) {
          reject(cardValidation.message);
          return;
        }
      }

      // Calculate order totals
      const subtotal = Cart.getTotal();
      const discount = Cart.appliedCoupon
        ? Coupons.calculateDiscount(Cart.appliedCoupon, subtotal)
        : 0;
      const shipping = 0;
      const total = subtotal - discount + shipping;

      // Create order object
      const order = {
        id: generateOrderId(),
        items: Cart.items,
        customer: {
          billing: {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            phone: form.phone.value,
            address: form.address.value,
            city: form.city.value,
            zipCode: form.zipCode.value,
            country: form.country.value,
          },
          shipping: form.sameAsBilling.checked
            ? null
            : {
                firstName: form.shippingFirstName.value,
                lastName: form.shippingLastName.value,
                address: form.shippingAddress.value,
                city: form.shippingCity.value,
                zipCode: form.shippingZipCode.value,
                country: form.shippingCountry.value,
              },
        },
        payment: {
          method: paymentMethod,
          ...(paymentMethod === "card" && {
            cardLastFour: form.cardNumber.value.slice(-4),
            cardType: getCardType(form.cardNumber.value),
          }),
        },
        pricing: {
          subtotal: subtotal,
          discount: discount,
          shipping: shipping,
          total: total,
          coupon: Cart.appliedCoupon,
        },
        notes: form.orderNotes.value,
        newsletter: form.newsletter.checked,
        status: "confirmed",
        date: new Date().toISOString(),
      };

      // Save order
      const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      existingOrders.push(order);
      localStorage.setItem("orders", JSON.stringify(existingOrders));

      // Clear cart
      Cart.clear();

      resolve(order);
    } catch (error) {
      reject("Payment processing failed. Please try again.");
    }
  });
}

function validateCardDetails(form) {
  const cardNumber = form.cardNumber.value.replace(/\s+/g, "");
  const expiry = form.expiryDate.value;
  const cvv = form.cvv.value;

  // Basic card number validation (16 digits)
  if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
    return {
      valid: false,
      message: "Please enter a valid 16-digit card number",
    };
  }

  // Basic expiry validation (MM/YY format)
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return {
      valid: false,
      message: "Please enter expiry date in MM/YY format",
    };
  }

  const [month, year] = expiry.split("/");
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  if (parseInt(month) < 1 || parseInt(month) > 12) {
    return { valid: false, message: "Please enter a valid expiry month" };
  }

  if (
    parseInt(year) < currentYear ||
    (parseInt(year) === currentYear && parseInt(month) < currentMonth)
  ) {
    return { valid: false, message: "Card has expired" };
  }

  // Basic CVV validation (3-4 digits)
  if (cvv.length < 3 || cvv.length > 4 || !/^\d+$/.test(cvv)) {
    return { valid: false, message: "Please enter a valid CVV" };
  }

  return { valid: true };
}

function getCardType(cardNumber) {
  const number = cardNumber.replace(/\s+/g, "");
  if (number.startsWith("4")) return "Visa";
  if (number.startsWith("5") || number.startsWith("2")) return "Mastercard";
  if (number.startsWith("3")) return "American Express";
  return "Unknown";
}

function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
}

function showNotification(message, type = "success") {
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
if (!document.querySelector("style[data-checkout-animation]")) {
  const style = document.createElement("style");
  style.setAttribute("data-checkout-animation", "true");
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
