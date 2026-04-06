# Favourdome E-commerce Website

## Overview

This is a static e-commerce website built with HTML, CSS, and JavaScript. It is designed as a product showcase and shopping experience for mobile phones and accessories. The site includes a home page, shop page, cart page, checkout page, order confirmation page, contact page, and blog/about pages.

## What the Website Does

- Displays featured smartphone products on the home page
- Shows product cards and allows users to add items to the cart
- Stores cart items in browser `localStorage` so the cart persists between page refreshes
- Includes a checkout flow for placing an order
- Shows an order confirmation page after checkout
- Provides contact and informational pages for site visitors
- Uses simple interactive JavaScript for navigation, cart behavior, and form-handling

## Key Features

- **Responsive navigation bar** with mobile-friendly menu behavior
- **Featured product cards** with image, name, price, and add-to-cart button
- **Cart page** with item list, quantity handling, and checkout redirect
- **Checkout page** with billing details and payment flow
- **Order confirmation** page that displays a completed order summary
- **Footer links and social icons** on all pages
- **Static product data** stored in `products-data.js`

## Main Files and Structure

- `index.html` — Home page with hero section, feature cards, and product grid
- `shop.html` — Shop page with product listings
- `cart.html` — Cart page to review items and proceed to checkout
- `checkout.html` — Checkout page for entering customer and payment information
- `order-confirmation.html` — Order success page after checkout
- `about.html`, `contact.html`, `blog.html` — Static informational pages
- `style.css` — Global styling and layout rules for the whole site
- `script.js` — Main site interactivity, navigation, add-to-cart behavior, footer link fixes
- `cart.js` — Cart management code and checkout redirect logic
- `checkout.js` — Checkout form handling and validation
- `order-confirmation.js` — Order summary and confirmation logic
- `product-gallery.js` — Product view loading logic (if product detail page logic is still present)
- `products-data.js` — Product definitions, prices, images, and colors
- `form-handler.js` — General form handling for newsletter or contact forms
- `images/` — All image assets used by the site

## What Was Created

- A clean, multi-page front-end e-commerce experience
- Product listings and shopping cart functionality using JavaScript
- Checkout and confirmation pages suitable for a basic online ordering flow
- Feature cards, responsive layout, and consistent visual styling
- Placeholder sections for marketing, blog, contact, and support

## Notes for Deployment

This is a static website, so it can be hosted on any static hosting platform such as:

- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- Azure Static Web Apps

To deploy, upload the repository files or connect a GitHub repository to the hosting service.

## Improvement Ideas

1. **Fix image fit and spacing** on product cards and homepage features
2. **Fully implement product detail pages** or remove unused detail page scripts if not needed
3. **Add real product pages** with unique product URLs and better image galleries
4. **Improve checkout validation** and display more detailed order totals, shipping, and taxes
5. **Make the site fully responsive** for tablet and mobile screens
6. **Add search and filtering** on the shop page for better browsing
7. **Improve accessibility** with better keyboard navigation and ARIA labels
8. **Add real payment integration** if moving beyond static demo behavior
9. **Add shipping/coupon logic** to the cart and checkout flow
10. **Refine branding** with a polished color palette, typography, and icon consistency

## Current Status

- Solid static prototype with cart and checkout flow
- No server-side backend required
- Suitable for deployment as a frontend showcase or demo store
- Can be improved with better layout polish and product detail handling

## How to Run Locally

1. Open the project folder in a browser directly, or
2. Use a local HTTP server for best results:
   - `npx http-server` if Node.js is installed
   - or use any built-in VS Code Live Server extension

## Contact

If you want, I can also help create a deployment guide for GitHub Pages, Netlify, or Vercel next.
