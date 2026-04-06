const bar = document.getElementById("bar");
const close = document.getElementById("close");
const nav = document.getElementById("navbar");

if (bar) {
  bar.addEventListener("click", () => {
    nav.classList.add("active");
  });
}

if (close) {
  close.addEventListener("click", () => {
    nav.classList.remove("active");
  });
}

// ===== PRODUCT INTERACTION =====
document.addEventListener("DOMContentLoaded", function () {
  // Product cards no longer navigate to singleproduct.html because the product detail page has been removed.
  // The cart buttons remain interactive below.

  // Add to cart button functionality
  const cartButtons = document.querySelectorAll(".cart");
  cartButtons.forEach((btn) => {
    btn.style.cursor = "pointer";
    btn.setAttribute("role", "button");
    btn.setAttribute("tabindex", "0");
    btn.setAttribute("aria-label", "Add to cart");

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Get product details from closest product card
      const productCard = this.closest(".pro");
      if (productCard) {
        const name = productCard.querySelector("h4")?.textContent || "Product";
        const price = productCard.querySelector("h3")?.textContent || "$0.00";
        const image = productCard.querySelector("img")?.src || null;

        // Add to cart
        addToCart(
          "product_" + name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
          name,
          price,
          1,
          image,
        );
      }
    });

    btn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Fix footer placeholder links on static pages
  const footerLinkMap = {
    "About Us": "about.html",
    "Delivery Information": "about.html",
    "Privacy Policy": "about.html",
    "Terms & Condition": "about.html",
    "Contact Us": "contact.html",
    "Sign In": "contact.html",
    "View Cart": "cart.html",
    "My Wishlist": "shop.html",
    "Track My Order": "contact.html",
    Help: "contact.html",
  };

  const footerAnchors = document.querySelectorAll("footer a");
  footerAnchors.forEach((link) => {
    const text = link.textContent.trim();
    if (footerLinkMap[text]) {
      link.href = footerLinkMap[text];
    }
  });

  const footerSocialLinks = {
    facebook: "https://www.facebook.com/favour.agbaike.1",
    instagram: "https://www.instagram.com/agbaikef",
  };

  const socialIcons = document.querySelectorAll("footer .follow .icon i");
  socialIcons.forEach((icon) => {
    let href = null;
    const className = icon.className.toLowerCase();

    if (className.includes("fa-facebook")) {
      href = footerSocialLinks.facebook;
    } else if (className.includes("fa-instagram")) {
      href = footerSocialLinks.instagram;
    }

    const parent = icon.parentElement;

    if (href) {
      // Create clickable link for available social accounts
      if (parent && parent.tagName.toLowerCase() !== "a") {
        const link = document.createElement("a");
        link.href = href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.style.cursor = "pointer";
        icon.replaceWith(link);
        link.appendChild(icon);
      } else if (parent) {
        parent.href = href;
        parent.target = "_blank";
        parent.rel = "noopener noreferrer";
      }
    } else {
      // Disable unavailable social icons
      icon.style.opacity = "0.4";
      icon.style.cursor = "not-allowed";
      icon.setAttribute("title", "Coming soon");

      if (parent && parent.tagName.toLowerCase() !== "a") {
        parent.style.opacity = "0.4";
        parent.style.cursor = "not-allowed";
      }
    }
  });
});

// ===== ADD TO CART FUNCTION =====
function addProductToCart(cartElement) {
  const productCard = cartElement.closest(".pro");
  if (productCard) {
    const name = productCard.querySelector("h4")?.textContent || "Product";
    const price = productCard.querySelector("h3")?.textContent || "$0.00";
    const image = productCard.querySelector("img")?.src || null;

    addToCart(
      "product_" + name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
      name,
      price,
      1,
      image,
    );
  }
}
