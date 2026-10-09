# OXI-STORE

A modern storefront website for a Minecraft SMP server, built to showcase ranks, crate keys, and a streamlined payment flow.

## Overview

OXI-STORE is a lightweight static web app designed for server communities that want to sell:

- Rank upgrades
- Crate keys
- In-game perks and cosmetics
- Fast checkout experience with cart and payment modal

The project is built with plain HTML, CSS, and JavaScript, making it easy to deploy and customize.

## Features

- Responsive store layout for desktop and mobile devices
- Product cards for ranks and crate keys
- Shopping cart with quantity tracking
- Checkout modal with UPI payment flow
- Google Apps Script backend integration for payment logging
- Cart persistence using browser local storage
- Clean glassmorphism-inspired UI
- Discord and contact CTA buttons

## Project Structure

```text
OXI-STORE/
├── index.html        # Homepage
├── store.html        # Storefront page
├── style.css         # Site styling and responsive layout
├── script.js         # Cart, checkout, and form logic
├── README.md         # Project documentation
└── assets/           # Optional future assets directory
```

## Pages

### Home
- Server branding
- Hero section
- Community information
- Join call-to-actions

### Store
- Rank categories
- Crate key products
- Purchase and add-to-cart actions
- Cart and checkout modals

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Google Apps Script (for payment logging endpoint)

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/JAEX4U/OXI-STORE.git
```

2. Navigate into the project directory:

```bash
cd OXI-STORE
```

3. Open `index.html` in your browser, or serve it locally with a small static server if preferred.

Example:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Configuration

The app uses a Google Apps Script endpoint in `script.js` for submitting payment data.

```javascript
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/.../exec";
```

Replace this URL with your own deployed Apps Script endpoint if you want to connect the store to your own payment logging backend.

## Deployment

This project can be deployed on:

- GitHub Pages
- Netlify
- Vercel
- Any static hosting provider

## License

This project is open for personal and community use. If you plan to use it commercially, please ensure you have the right permissions for the branding, assets, and server content included.

## Contact

- Email: dioxsupport@gmail.com
- Discord: https://discord.gg/EpnjfuHgjT

## Notes

This is a storefront template tailored for a Minecraft server brand, but it can be adapted for other gaming or community-based businesses with minimal changes.
