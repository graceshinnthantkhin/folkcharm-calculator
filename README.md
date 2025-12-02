# Folkcharm Supply Chain Calculator

A comprehensive, privacy-first React application designed to calculate Scope 3 Carbon Footprint and track production batch composition for Folkcharm's supply chain.

## 📋 Overview

The Folkcharm Calculator is a **4-step wizard** that collects specific production data to generate an environmental impact report. It is designed as a client-side Single Page Application (SPA), ensuring that sensitive supply chain data remains local to the user's device until explicitly exported.

### Key Features

*   **Carbon Footprint Calculation (Scope 3)**:
    *   **Materials**: Farm-level soil organic carbon (SOC) and material production emissions.
    *   **Logistics**: Transport emissions based on vehicle type (Light/Heavy) and distance.
    *   **Production**: Energy consumption (Thai Grid) and accessory usage.
*   **Privacy-First**: All calculations occur in the browser. Data is persisted via `localStorage` for convenience but is not sent to any external server.
*   **PDF Export**: Built-in "Print to PDF" functionality generates a clean, formal report for internal records.

## 🛠 Tech Stack

*   **Framework**: [React](https://react.dev/) (TypeScript)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Charts**: [Recharts](https://recharts.org/)

## 🚀 Getting Started

### Prerequisites

*   Node.js (v16 or higher recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/folkcharm-calculator.git
    cd folkcharm-calculator
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` in your browser.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate a `dist` folder containing the static files ready for deployment on Vercel, Netlify, or GitHub Pages.

## 📂 Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui/          # Reusable UI elements (Buttons, Inputs, Cards)
│   │   ├── Step*.tsx    # Individual wizard steps
│   │   └── ...
│   ├── utils/
│   │   └── calculator.ts # Core logic for emissions math
│   ├── App.tsx          # Main routing and state management
│   ├── constants.ts     # Emission factors and static values
│   ├── types.ts         # TypeScript interfaces and data models
│   └── main.tsx         # Application entry point
├── index.html           # HTML entry point
└── tailwind.config.js   # Styling configuration
```

## 🧮 Calculation Methodology

The application uses specific emission factors defined in `src/constants.ts`.

**Key Formulae:**

*   **Transport Emissions**: `Weight (tons) × Distance (km) × Vehicle EF`
    *   *Light Vehicle EF*: 0.245 kg CO₂/tkm
    *   *Heavy Vehicle EF*: 0.129 kg CO₂/tkm
*   **Electricity**: `Hours × 0.25 kW (Machine Power) × 0.399 kg CO₂/kWh (Thai Grid)`
*   **SC Grand Yarn**: Fixed factor of 0.35 kg CO₂e/kg.

## 📄 License

Internal Tool for Folkcharm. All rights reserved.