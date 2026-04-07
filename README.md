# Favourdome E-Commerce Store

### Deployed on Microsoft Azure | Cloud Engineering Portfolio Project

[![Azure Static Web Apps](https://img.shields.io/badge/Azure-Static%20Web%20Apps-0078D4?logo=microsoft-azure)](https://witty-ocean-089724a03.2.azurestaticapps.net)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions)](https://github.com/agbaike/favourdome-ecommerce-website/actions)
[![Security](https://img.shields.io/badge/Security-MFA%20%2B%20HTTPS-green)](https://witty-ocean-089724a03.2.azurestaticapps.net)
[![Free Tier](https://img.shields.io/badge/Cost-Free%20Tier-brightgreen)](https://azure.microsoft.com/free)

**Live Site:** [https://witty-ocean-089724a03.2.azurestaticapps.net](https://witty-ocean-089724a03.2.azurestaticapps.net)

---

## What This Project Is

Favourdome is a fully functional e-commerce website for mobile phones and accessories. It was built with HTML, CSS, and JavaScript — and then deployed to the cloud using Microsoft Azure, following professional cloud engineering standards.

This README documents not just what the website does, but **how it was deployed**, **why each decision was made**, and **what security measures were put in place** — the way a real Cloud Engineer would document their work.

---

## What the Website Does

The website gives users a complete online shopping experience:

- Browse the latest smartphones on the **Home** and **Shop** pages
- Add products to a **Shopping Cart** that remembers items even after closing the browser
- Go through a full **Checkout** process with billing details and payment options
- Receive an **Order Confirmation** page with a full order summary
- Read product reviews and news on the **Blog** page
- Get in touch via the **Contact** page with a working form and office map

---

## Cloud Architecture Overview

The diagram below shows how everything connects — from the moment a developer saves code, all the way to a user viewing the site on their phone anywhere in the world.

```
Developer (VS Code)
       |
       | git push
       ↓
GitHub Repository (favourdome-ecommerce-website)
       |
       | automatically triggers
       ↓
GitHub Actions — CI/CD Pipeline
       |
       | deploys to
       ↓
┌─────────────────────────────────────────────────────────┐
│               Microsoft Azure (West Europe)              │
│                                                          │
│   Resource Group: rg-ecommerce-prod-001                  │
│   Tags: Environment=Production | Project=E-Commerce      │
│                                                          │
│   ┌──────────────────────┐   ┌────────────────────────┐ │
│   │  Azure Static Web App│──▶│    Global CDN          │ │
│   │  stapp-ecommerce-    │   │   (auto-provisioned)   │ │
│   │  web-prod            │   └────────────────────────┘ │
│   └──────────────────────┘             │                 │
│            │                           │                 │
│   ┌────────┴──────────┐                │                 │
│   │   SSL/TLS Cert    │                │                 │
│   │  (free, managed)  │                │                 │
│   └───────────────────┘                │                 │
│                                        ↓                 │
│              Security headers applied at platform level  │
└─────────────────────────────────────────────────────────┘
                              │
                              ↓
                     End User (Browser)
               Fast, secure, from anywhere
```

---

## Phase-by-Phase Breakdown

### Phase 1 — Identity and Governance

**What was done:** Secured the Azure account and created a proper container for all project resources.

**Why it matters:** In professional cloud engineering, you never just "log in and start clicking." Everything is organised, named properly, and secured before any resources are created. Think of it like setting up a proper filing system before you start working — it keeps things manageable and auditable.

**What was created:**

- **Multi-Factor Authentication (MFA)** was enabled on the Azure account. This means even if someone knows the password, they cannot log in without also approving it on a trusted phone. This is required for all professional Azure work from October 2025 onwards.
- **Resource Group** named `rg-ecommerce-prod-001` was created in West Europe (geographically closest to Berlin). A Resource Group is like a folder in the cloud — it holds everything related to this project in one organised place.
- **Resource Tags** were applied: `Environment: Production` and `Project: E-Commerce`. Tags are labels that let you track which resources belong to which project, and what they cost — essential in a professional team environment.

---

### Phase 2 — Source Control and DevOps Pipeline

**What was done:** Connected the project code to Azure through GitHub, with automatic deployment on every code change.

**Why it matters:** Modern software is never deployed manually. Professionals use automated pipelines so that the moment code is approved and merged, it goes live — without anyone manually uploading files or logging into servers. This is called CI/CD (Continuous Integration / Continuous Deployment).

**What was created:**

- **GitHub Repository** (`favourdome-ecommerce-website`) stores all the project files with full version history. Every change is tracked, every version can be restored.
- **GitHub Actions Workflow** (`.github/workflows/azure-static-web-apps.yml`) is an automated script that runs every time code is pushed to the `main` branch. It picks up the files and sends them to Azure automatically.
- **Deployment Secret** (`AZURE_STATIC_WEB_APPS_API_TOKEN`) was stored securely in GitHub's secrets vault. This is the "key" that lets GitHub Actions talk to Azure — and it's never visible in the code itself, keeping it safe.

**The flow in plain English:** A developer saves code → pushes it to GitHub → GitHub sees the change → automatically sends it to Azure → the live website updates within 60 seconds.

---

### Phase 3 — Infrastructure and Hosting

**What was done:** Deployed the website on Azure's managed hosting service with global content delivery.

**Why it matters:** The choice of how to host a website has enormous implications for speed, reliability, and cost. Azure Static Web Apps was chosen because it matches the project perfectly — it is designed for exactly this type of website (HTML, CSS, JavaScript with no server needed), it is free, and it comes with professional-grade features built in.

**What was created:**

- **Azure Static Web App** (`stapp-ecommerce-web-prod`) is the core hosting service. It takes the website files and makes them available on the internet at a permanent URL.
- **Global CDN (Content Delivery Network)** was automatically provisioned by Azure as part of the Static Web App. A CDN works by storing copies of the website in multiple data centres around the world. When a user in Japan visits the site, they get served from a nearby server in Asia — not from one far away in Europe. This makes the site load faster for everyone, everywhere.
- **Free SSL/TLS Certificate** was automatically issued and managed by Azure. This is what puts the padlock icon in the browser address bar and changes the URL from `http://` to `https://`. It means all data between the user's browser and the server is encrypted — particularly important for a shopping site where users enter personal details.

---

### Phase 4 — Security and Compliance

**What was done:** Applied security policies at the platform level so the website is protected against common web attacks.

**Why it matters:** A website without security headers is like a shop with no locks. Even if the website itself looks fine, attackers can exploit gaps in how the browser communicates with the server. Security headers are instructions sent to the user's browser telling it exactly what it is and is not allowed to do when displaying the site.

**What was configured** (in `staticwebapp.config.json`):

- **`Strict-Transport-Security`** — Tells browsers: "This site must always be accessed over HTTPS. Never allow an unencrypted connection, even if someone tries to force one." This protects against a type of attack where someone intercepts your connection before it becomes encrypted.

- **`X-Content-Type-Options: nosniff`** — Tells browsers: "Trust the file type I declare. Don't try to guess what kind of file something is." This prevents a type of attack where a malicious file disguises itself as something harmless.

- **`X-Frame-Options: SAMEORIGIN`** — Tells browsers: "This website cannot be embedded inside another website's frame." This prevents "clickjacking" — a technique where an attacker puts an invisible copy of your site on top of their own, tricking users into clicking things they didn't intend to.

- **`Referrer-Policy: strict-origin-when-cross-origin`** — Controls what information is shared when a user clicks a link to leave the site. Limits the exposure of internal site paths to external websites.

- **`Permissions-Policy`** — Explicitly disables access to the device's microphone, camera, and location services. No one can use the website to access these — even if a malicious script somehow ended up on the page.

**Why this is impressive:** Most websites deployed by beginners skip security headers entirely. Having these configured shows an understanding of the full security stack, not just "making things work."

---

### Phase 5 — Observability and Monitoring

**What was done:** Configured Azure Application Insights so the health of the site can be monitored in real time.

**Why it matters:** In a professional environment, you do not wait for users to report problems. You have monitoring in place that tells you if something breaks — ideally before users even notice. This is called observability.

**What was set up:**

- **Application Insights SDK** was added to every HTML page. This sends anonymous telemetry data to Azure — things like: how many people visited today, which pages they viewed, how long pages took to load, and whether any errors occurred.
- **Azure Activity Logs** are built into every Azure resource automatically. Every action taken on the infrastructure — who created what, when it was modified, when a deployment ran — is logged and stored for audit purposes.

---

## Project File Structure

```
favourdome-ecommerce-website/
│
├── .github/
│   └── workflows/
│       └── azure-static-web-apps.yml    ← CI/CD pipeline definition
│
├── images/                              ← All product and site images
│
├── index.html                           ← Home page
├── shop.html                            ← Product listings
├── cart.html                            ← Shopping cart
├── checkout.html                        ← Order and payment form
├── order-confirmation.html              ← Post-purchase confirmation
├── about.html                           ← About the store
├── contact.html                         ← Contact form and map
├── blog.html                            ← Product news and reviews
│
├── style.css                            ← All visual styling
├── script.js                            ← Navigation and cart interactions
├── cart.js                              ← Cart logic using browser storage
├── checkout.js                          ← Checkout form and validation
├── order-confirmation.js                ← Order summary display
├── products-data.js                     ← Product catalogue (names, prices, images)
├── form-handler.js                      ← Contact and newsletter forms
│
└── staticwebapp.config.json             ← Azure config: routing and security headers
```

---

## Technologies Used

| Technology              | Purpose                               |
| ----------------------- | ------------------------------------- |
| HTML5, CSS3, JavaScript | Website front-end                     |
| Browser localStorage    | Cart persistence (no database needed) |
| Microsoft Azure         | Cloud hosting platform                |
| Azure Static Web Apps   | Hosting service (free tier)           |
| Azure CDN               | Global content delivery               |
| Azure Entra ID / MFA    | Identity and account security         |
| GitHub                  | Source code version control           |
| GitHub Actions          | Automated CI/CD deployment pipeline   |
| Application Insights    | Real-time monitoring and telemetry    |

---

## Key Engineering Decisions and Why

**Why Azure Static Web Apps instead of a regular server?**
The website is "static" — it runs entirely in the visitor's browser and does not need a backend server to generate pages. Azure Static Web Apps is purpose-built for exactly this. It is cheaper (free), more reliable, and automatically handles CDN and SSL — things that would need manual configuration on a regular server.

**Why GitHub Actions instead of manual deployment?**
Manual deployment means a human physically uploading files every time something changes. This is slow, error-prone, and not traceable. GitHub Actions means every deployment is automated, consistent, logged, and can be rolled back if something goes wrong. This is how all professional teams work.

**Why West Europe as the Azure region?**
The developer and primary users are based in Berlin, Germany. Choosing a geographically close region reduces latency — the distance data has to travel — making the site faster for the target audience.

**Why use Resource Tags?**
Tags like `Environment: Production` may seem unnecessary for a personal project, but they demonstrate understanding of how organisations manage cloud costs. In a company with hundreds of resources, tags are how finance teams know what is being spent on what project.

---

## How to Run This Project Locally

If you want to run this project on your own computer:

1. Clone the repository:

   ```bash
   git clone https://github.com/agbaike/favourdome-ecommerce-website.git
   ```

2. Open the folder in VS Code

3. Use the Live Server extension to open `index.html`, or run:

   ```bash
   npx http-server
   ```

4. Open your browser and go to `http://127.0.0.1:5500`

---

## How to Deploy Your Own Version to Azure

1. Fork this repository to your own GitHub account
2. Create a free Azure account at [portal.azure.com](https://portal.azure.com)
3. Enable MFA on your Azure account (required)
4. Create a Resource Group in Azure Portal
5. Create an Azure Static Web App, linking it to your GitHub fork
6. Azure will automatically create the GitHub Actions workflow
7. Add the deployment token to your GitHub repository secrets
8. Push any change to `main` — the site deploys automatically

---

## Portfolio Summary

This project demonstrates the following Cloud Engineering competencies:

- **Cloud Governance** — Resource Groups, naming conventions, and resource tagging following enterprise standards
- **Identity Security** — MFA via Microsoft Entra ID, principle of least privilege
- **Infrastructure as Configuration** — Platform-level settings managed through `staticwebapp.config.json`
- **DevOps / CI/CD** — Fully automated deployment pipeline using GitHub Actions
- **Network Security** — HTTP security headers protecting against clickjacking, sniffing, and protocol downgrade attacks
- **Performance Engineering** — Global CDN distribution ensuring fast load times worldwide
- **Observability** — Application Insights telemetry and Azure Activity Logs for monitoring and audit
- **Cost Management** — Entire production infrastructure deployed at zero cost using appropriate free-tier services

---

## Author

**Favour Agbaikeoghene Iruoghene**
Cloud & DevOps Engineer | Berlin, Germany

[![GitHub](https://img.shields.io/badge/GitHub-agbaike-181717?logo=github)](https://github.com/agbaike)

---

_This project was built as part of a cloud engineering portfolio to demonstrate hands-on experience with Microsoft Azure, DevOps pipelines, and production-grade web deployment practices._
