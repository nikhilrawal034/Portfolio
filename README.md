# Nikhil's Portfolio

A high-performance product management, UX design, and business analysis portfolio website optimized with Framer and served locally via Vite.

## 🚀 Getting Started

To run the local development server and preview the portfolio locally, ensure you have [Node.js](https://nodejs.org/) installed, and then run:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```

The server will spin up a local instance, usually available at **[http://localhost:5173](http://localhost:5173)**, with instant hot reloading.

---

## 🛠️ Tech Stack & Structure

- **Core Framework**: Static HTML/CSS/JS export optimized by **Framer**.
- **Styles**: Inline compiled CSS utility classes and media queries mapping to mobile, tablet, and desktop breakpoints. Supports automatic light/dark color variables.
- **Fonts**: Asynchronous Google Fonts loading (`DM Sans`, `Fragment Mono`) with custom layout-shift metrics placeholders to prevent CLS.
- **Local Dev Server**: [Vite](https://vitejs.dev/) for quick, configuration-free, and high-performance local hot module reloading (HMR).
- **Deployment**: Configured with a `CNAME` targeting `nikhilportfolio.life` for custom GitHub Pages mapping.

---

## 📂 Key Files

- `index.html`: Core single-page website containing compiled SSR markup, responsive styles, metadata, and assets.
- `package.json`: Configuration for local development and build scripts.
- `CNAME`: Domain configuration mapping file.