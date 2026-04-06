/**
 * Order Confirmation Page
 * Displays order details after successful checkout
 */

document.addEventListener("DOMContentLoaded", function () {
  loadOrderConfirmation();
});

function loadOrderConfirmation() {
  // Get the most recent order
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  if (orders.length === 0) {
    showError("No order found. Redirecting to shop...");
    setTimeout(() => {
      window.location.href = "shop.html";
    }, 2000);
    return;
  }

  const latestOrder = orders[orders.length - 1];
  displayOrderDetails(latestOrder);
}

function displayOrderDetails(order) {
  // Order header
  document.getElementById("orderId").textContent = order.id;
  document.getElementById("orderDate").textContent = formatDate(order.date);

  // Billing address
  const billingAddress = document.getElementById("billingAddress");
  billingAddress.innerHTML = `
    <p>${order.customer.billing.firstName} ${order.customer.billing.lastName}</p>
    <p>${order.customer.billing.address}</p>
    <p>${order.customer.billing.city}, ${order.customer.billing.zipCode}</p>
    <p>${getCountryName(order.customer.billing.country)}</p>
  `;

  // Shipping address
  const shippingAddress = document.getElementById("shippingAddress");
  if (order.customer.shipping) {
    shippingAddress.innerHTML = `
      <p>${order.customer.shipping.firstName} ${order.customer.shipping.lastName}</p>
      <p>${order.customer.shipping.address}</p>
      <p>${order.customer.shipping.city}, ${order.customer.shipping.zipCode}</p>
      <p>${getCountryName(order.customer.shipping.country)}</p>
    `;
  } else {
    shippingAddress.innerHTML = `
      <p>Same as billing address</p>
    `;
  }

  // Contact info
  const contactInfo = document.getElementById("contactInfo");
  contactInfo.innerHTML = `
    <p><strong>Email:</strong> ${order.customer.billing.email}</p>
    <p><strong>Phone:</strong> ${order.customer.billing.phone}</p>
  `;

  // Payment info
  const paymentInfo = document.getElementById("paymentInfo");
  let paymentText = "";
  if (order.payment.method === "card") {
    paymentText = `${order.payment.cardType} ending in ${order.payment.cardLastFour}`;
  } else if (order.payment.method === "paypal") {
    paymentText = "PayPal";
  } else if (order.payment.method === "bank") {
    paymentText = "Bank Transfer";
  }
  paymentInfo.innerHTML = `<p>${paymentText}</p>`;

  // Order items
  const orderItems = document.getElementById("orderItems");
  orderItems.innerHTML = "";

  order.items.forEach((item) => {
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace("$", ""))
        : item.price;
    const subtotal = price * item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className = "order-item";
    itemDiv.innerHTML = `
      <div class="item-image">
        <img src="${item.image || "images/placeholder.jpg"}" alt="${item.name}" />
      </div>
      <div class="item-details">
        <h5>${item.name}</h5>
        <p class="item-price">$${price.toFixed(2)} each</p>
        <p class="item-quantity">Quantity: ${item.quantity}</p>
        <p class="item-subtotal"><strong>$${subtotal.toFixed(2)}</strong></p>
      </div>
    `;
    orderItems.appendChild(itemDiv);
  });

  // Order summary
  const orderSummary = document.getElementById("orderSummary");
  orderSummary.innerHTML = `
    <div class="summary-row">
      <span>Subtotal:</span>
      <span>$${order.pricing.subtotal.toFixed(2)}</span>
    </div>
    ${
      order.pricing.discount > 0
        ? `
    <div class="summary-row discount-row">
      <span>Discount (${order.pricing.coupon.code}):</span>
      <span>-$${order.pricing.discount.toFixed(2)}</span>
    </div>
    `
        : ""
    }
    <div class="summary-row">
      <span>Shipping:</span>
      <span>${order.pricing.shipping === 0 ? "Free" : "$" + order.pricing.shipping.toFixed(2)}</span>
    </div>
    <div class="summary-row total-row">
      <span><strong>Total:</strong></span>
      <span><strong>$${order.pricing.total.toFixed(2)}</strong></span>
    </div>
  `;

  // Order notes
  if (order.notes && order.notes.trim()) {
    document.getElementById("orderNotesSection").style.display = "block";
    document.getElementById("orderNotes").textContent = order.notes;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getCountryName(countryCode) {
  const countries = {
    US: "United States",
    CA: "Canada",
    GB: "United Kingdom",
    DE: "Germany",
    FR: "France",
    IT: "Italy",
    ES: "Spain",
    AU: "Australia",
    JP: "Japan",
  };
  return countries[countryCode] || countryCode;
}

function printOrder() {
  window.print();
}

function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #dc3545;
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    z-index: 10000;
  `;
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}
