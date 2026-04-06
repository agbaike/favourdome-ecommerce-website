function getQueryParameter(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function loadProductDetails() {
  const productId = getQueryParameter("id");
  console.log("Loading product with ID:", productId); // Debug log

  if (!productId) {
    console.log("No product ID found in URL");
    return;
  }

  if (typeof PRODUCTS === "undefined") {
    console.log("PRODUCTS object not loaded");
    return;
  }

  const product = PRODUCTS[productId];
  if (!product) {
    console.log(
      "Product not found:",
      productId,
      "Available products:",
      Object.keys(PRODUCTS),
    );
    return;
  }

  const mainImage = document.getElementById("Mainimg");
  const thumbnails = document.querySelectorAll(".small-img");
  const productName = document.getElementById("productName");
  const productPrice = document.getElementById("productPrice");
  const productDesc = document.querySelector(".single-product-details span");
  const colorSelect = document.getElementById("colorSelect");

  console.log("Product found:", product); // Debug log

  if (productName) {
    productName.textContent = product.name;
  }

  if (productPrice) {
    productPrice.textContent = `$${product.price.toFixed(2)}`;
  }

  if (productDesc) {
    productDesc.textContent = product.description;
  }

  if (mainImage) {
    mainImage.src = product.images[0] || mainImage.src;
    mainImage.alt = `${product.name} main image`;
  }

  if (colorSelect) {
    colorSelect.innerHTML = "<option value=''>Select Color</option>";
    product.colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color.toLowerCase();
      option.textContent = color;
      colorSelect.appendChild(option);
    });

    colorSelect.addEventListener("change", function () {
      const selectedColor = this.value.toLowerCase();
      if (
        selectedColor &&
        product.colorImages &&
        product.colorImages[selectedColor]
      ) {
        mainImage.src = product.colorImages[selectedColor];
        mainImage.alt = `${product.name} ${selectedColor}`;
      } else {
        mainImage.src = product.images[0] || mainImage.src;
        mainImage.alt = `${product.name} main image`;
      }
    });
  }

  thumbnails.forEach((thumbnail, index) => {
    const imageUrl =
      product.images[index] || product.images[0] || "images/placeholder.jpg";
    thumbnail.src = imageUrl;
    thumbnail.alt = `${product.name} view ${index + 1}`;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Wait for PRODUCTS to be defined (from products-data.js)
  function initializeProductPage() {
    if (typeof PRODUCTS !== "undefined") {
      loadProductDetails();
      setupGalleryInteraction();
    } else {
      // Retry if PRODUCTS not yet loaded (with longer timeout)
      setTimeout(initializeProductPage, 200);
    }
  }

  initializeProductPage();
});

function setupGalleryInteraction() {
  const mainImage = document.getElementById("Mainimg");
  const thumbnails = document.querySelectorAll(".small-img");
  const colorSelect = document.getElementById("colorSelect");

  if (thumbnails.length && mainImage) {
    thumbnails.forEach((thumbnail) => {
      thumbnail.style.cursor = "pointer";
      thumbnail.addEventListener("click", function () {
        mainImage.src = this.src;
        mainImage.alt = this.alt || "Selected product image";
      });

      thumbnail.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          this.click();
        }
      });
    });
  }

  if (colorSelect) {
    colorSelect.addEventListener("change", function () {
      if (this.value) {
        this.setAttribute("aria-label", `Selected color ${this.value}`);
      } else {
        this.setAttribute("aria-label", "Choose a color");
      }
    });
  }
}
