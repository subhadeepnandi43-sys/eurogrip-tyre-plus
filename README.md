# Eurogrip TYRE+

> **Your Tyre. Your Ride. Your Trusted Mechanic.**
> Connected Digital Tyre Passport, Anti-Counterfeit Vulcanized QR Verification, Real-Time Cold Pressure Telemetry, Enterprise Operations Console & Rider Virtual Cockpit.

---

## 🚀 Key Features

- **📱 Smart Bead QR & Barcode Scanner:** Real-time camera detection & synthetic Web Audio confirmation chime with haptic pulse.
- **📄 Official Digital Tyre Passport:** AIS-140 compliant serialization with direct Apple / Google Wallet integration.
- **🏍️ 32 Motorcycle Catalog:** Full specifications & pressure calibrations across Cruisers, Commuters, Sports, Adventure & Scooters.
- **👑 Dual Database Architecture:**
  - **Admin Command Console:** Live telemetry HQ, 5-year warranty ledger with CSV/JSON exports, factory batch QR minting terminal, and security audit logs.
  - **Rider Virtual Cockpit:** Mobile-exclusive gatekeeper with interactive desktop smartphone frame simulator, dynamic ride-mode cold pressure calculator, and partner garage booking.
- **🔐 Phone Number Authentication:** 10-digit mobile number login with automated 5-year warranty registration on sign-up.

---

## 🛠️ Tech Stack & Modular Architecture

- **Vanilla Modern Web Stack:** Pure HTML5, CSS3, and Modular ES6 JavaScript (Zero heavy external dependencies).
- **CSS Architecture:**
  - `css/base.css`: Root design tokens, typography, navbar, button system, and tags.
  - `css/components.css`: Hero section, photo showcases, problem analysis, phone simulator, and passport modal.
  - `css/portals.css`: Admin Operations Console, Rider Virtual Cockpit, digital gauges, and mobile simulator.
  - `css/style.css`: Master router with modular imports.
- **JavaScript Architecture:**
  - `js/data.js`: Catalog databases, phone utilities, and LocalStorage persistence.
  - `js/scanner.js`: Camera streams, Web Audio synthesis, and tyre dossier rendering.
  - `js/modules.js`: Interactive demo steps (A, B, C, D) and trust loop.
  - `js/auth.js`: Phone authentication, modal management, and session state.
  - `js/admin.js`: Enterprise command center, batch serial minting, and data exports.
  - `js/rider.js`: Rider cockpit, mobile gatekeeper, and cold pressure calculator.
  - `js/app.js`: Application orchestrator, theme toggle, and event lifecycle.

---

## 💻 Local Development

Run the included PowerShell server script:
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1 -port 8080
```
Then navigate to `http://localhost:8080/`.
