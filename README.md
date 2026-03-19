# TuTienda - E-Commerce Landing Page (V5)

## Overview
**TuTienda** is a modern, static e-commerce application built with a **modular JavaScript architecture**. It features a responsive design, dynamic product rendering, a persistent shopping cart, and robust internationalization (i18n).

## 🛠 Tech Stack
- **Core**: HTML5, Vanilla JavaScript (ES Modules)
- **Styling**: Tailwind CSS (v3.4) with PostCSS
- **Fonts**: DM Sans, Fraunces (Self-hosted via `@fontsource`)
- **Package Manager**: npm

## 📂 Project Structure

### HTML Entry Points
| File | Description | JS Entry Point |
|------|-------------|----------------|
| `index.html` | Main landing page (Hero, Featured Products). | `js/app/init-home.js` |
| `ofertas.html` | Discounted items view. | `js/app/init-offers.js` |
| `carrito.html` | Shopping cart and checkout summary. | `js/app/init-cart.js` |
| `contacto.html` | Contact form. | `js/app/init-contact.js` |

### JavaScript Architecture (`/js`)
The application uses native ES Modules (`import`/`export`) to organize code by domain.

#### 1. App Initializers (`/js/app/`)
These files are the entry points for each HTML page. They orchestrate the page setup by importing necessary modules.
- **`init-common.js`**: Runs on *every* page. Initializes the global Layout (Header/Footer), Cart state, and I18n.
- **`init-home.js`**: Renders the main product grid.
- **`init-cart.js`**: Renders the detailed cart view and summary.

#### 2. Domain Modules (`/js/modules/`)
Reusable logic is strictly separated by concern.

| Module Directory | Purpose |
|------------------|---------|
| **`data/`** | Contains static data (`products-data.js`) and data-fetching helpers. |
| **`i18n/`** | Internationalization logic. `translations.js` holds the dictionary; `i18n.js` handles language switching and text replacement. |
| **`cart/`** | Core cart logic (Add, Remove, Update Quantity, Persistence to `localStorage`). |
| **`currency/`** | Handles currency conversion (COP/USD/RUB) and formatting. |
| **`products/`** | Logic for rendering product cards (`product-card.js`) and the main grid (`product-grid.js`). |
| **`layout/`** | Renders the global Navbar and Footer. |
| **`ui/`** | Generic UI components like Modals, Toasts, and Media rendering. |
| **`security/`** | Input sanitization helpers (`sanitize.js`). |

## ✨ Key Features

### 1. Internationalization (i18n) & Currency
- **Languages**: Spanish (Default), English, Russian.
- **Currency**: Base prices are in **COP**.
  - Automatic conversion to USD/RUB based on rates defined in `js/modules/currency/currency.js`.
  - Prices update dynamically when language changes.
- **Implementation**: Uses `data-i18n` attributes in HTML.

### 2. Product Data Model
Products are defined in `js/modules/data/products-data.js`.
- **Attributes**: Ref, Name, Description (Keys), Prices (Regular & Sale), Colors, Sizes, Material.
- **Media**: Supports hybrid media (Images and MP4 Video with poster fallbacks).

### 3. Shopping Cart
- **Persistence**: Uses `localStorage` (`shoppingCart` key).
- **Architecture**: Decoupled state management. Visual components subscribe to state changes via custom events (`cartUpdated`).

## 🚀 Setup & Development

### Prerequisites
- Node.js & npm installed.

### Installation
```bash
npm install
```

### Running Locally
**Important:** Because this project uses **ES Modules**, you cannot simply open `index.html` in your browser via the file system (`file://`). You must use a local web server.

We recommend using `http-server`:

```bash
npx http-server -p 8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Development
To watch for CSS changes and rebuild Tailwind styles:
```bash
npx tailwindcss -i ./src/tailwind.css -o ./css/tailwind.css --watch
```

### Deployment
This is a static site. It can be deployed to any static host (GitHub Pages, Vercel, Netlify) by serving the root directory.

---
*Last Updated: February 12, 2026*
