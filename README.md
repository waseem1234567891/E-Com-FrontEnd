# 🛍️ E-commerce App (Frontend)

This is the **frontend** of the **E-commerce App** — a modern, responsive shopping platform built using **React** and **Tailwind CSS**, connected to a **Spring Boot backend** running on **port 8989**.

The frontend handles all user-facing features like browsing products, managing the cart, and handling authentication, while the backend provides RESTful APIs for business logic and data management.

---

## 🚀 Features

- 🏠 Beautiful, responsive UI built with Tailwind CSS  
- 🛒 Product listing and product detail pages  
- 🔍 Search and filter functionality  
- ❤️ Add to cart and wishlist  
- 👤 User login, registration, and management  
- 🧾 Checkout and order management  
- 📱 Fully responsive and mobile-friendly  

---

## 🧰 Tech Stack

- **React** – Frontend framework  
- **Tailwind CSS** – Styling and layout  
- **React Router DOM** – Client-side routing  
- **Axios** – For API calls to backend  
- **Spring Boot (Backend)** – REST API (on port **8989**)  

---

## 📦 Installation

Clone the repository and install the dependencies.

```bash
# Clone the repository
git clone https://github.com/your-username/ecommerce-frontend.git

# Navigate into the project folder
cd ecommerce-frontend


# Install dependencies
npm instal

🧑‍💻 Running the Project

Start the development server:

npm start


The frontend will run at:

http://localhost:3000


Make sure your Spring Boot backend is running at:

http://localhost:8989

⚙️ Environment Variables

Create a .env file in the root directory and add:

REACT_APP_API_URL=http://localhost:8989/api


Then restart the app:

npm start




📁 Folder Structure
E-COMMERCE-FRONTEND/
├── build/                  # Production build files
├── public/                 # Static assets and index.html
├── src/
│   ├── assets/             # Images, icons, etc.
│   ├── components/         # Reusable UI components
│   ├── context/            # Global state or context providers
│   ├── pages/              # Application pages (Home, Cart, etc.)
│   ├── services/           # Axios API service files
│   ├── util/               # Helper functions
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   └── setupTests.js
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md

🌐 Deployment

You can deploy your React app on:

Vercel

Netlify

GitHub Pages

Before deploying, build the app:

npm run build


Then deploy the build/ directory.

# Install dependencies
npm install
