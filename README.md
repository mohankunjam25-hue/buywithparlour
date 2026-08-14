# BuyWithParlour - Beauty & Salon E-Commerce Marketplace

BuyWithParlour is a full-stack multi-vendor e-commerce platform tailored for beauty consumers, salon professionals, and cosmetics merchants.

## 🏗️ Architecture

The project consists of 4 core modules:
- **`backend`**: Node.js & Express REST API with MongoDB Atlas, JWT authentication, and Cloudinary integration.
- **`frontend`**: Customer shopping marketplace built with React, Vite, and Tailwind CSS.
- **`seller-frontend`**: Partner studio for merchant onboarding, catalog listing, and inventory management.
- **`admin-frontend`**: Quality control (QC) moderation portal for product approvals and platform governance.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mohankunjam25-hue/buywithparlour.git
   cd buywithparlour
   ```

2. Install dependencies and start development servers:
   ```bash
   # Backend
   cd backend && npm install && npm run dev

   # Customer Frontend
   cd ../frontend && npm install && npm run dev

   # Seller Portal
   cd ../seller-frontend && npm install && npm run dev

   # Admin Portal
   cd ../admin-frontend && npm install && npm run dev
   ```

## 📄 License
ISC License © 2026 BuyWithParlour
