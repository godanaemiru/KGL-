#  Karibu Groceries Limited (KGL) - Enterprise POS & Inventory System

An enterprise-grade Point of Sale (POS) and Inventory Management web application custom-built for Karibu Groceries Limited. This system digitizes KGL's operations across their Maganjo and Matugga branches, providing role-based access, real-time analytics, and strict business-rule enforcement.

##  Live Demo
* **Frontend:** https://karibu-pi.vercel.app/
* **Backend API:** https://kgl-ogni.onrender.com/

---

## 👥 Test Credentials
To evaluate the system, please log in using the following seeded accounts. Each role has a completely different UI and permission set:

| Role | Username | Password | Branch | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **Director** | `director_orban` | `password123` | All | Full analytics, charts, staff directory, sales reports. |
| **Manager** | `manager_maganjo` | `password123` | Maganjo | Add stock (procurement), view inventory, record sales. |
| **Sales Agent** | `agent_matugga` | `password123` | Matugga | Record cash/credit sales, view available stock only. |

---

## ✨ Key Features & Business Logic

This application isn't just a database GUI; it actively enforces KGL's business rules:

* **Role-Based Access Control (RBAC):** UI routing and backend endpoints are heavily protected by JWT authentication. Agents cannot see Director analytics, and Managers can only operate within their assigned branch.
* **Smart Stock Deduction:** Every successful sale instantly communicates with the database to deduct the exact tonnage from the correct branch's inventory.
* **Minimum Procurement Thresholds:** The backend actively blocks Managers from procuring less than **100kg** of stock at a time.
* **Automated Low-Stock Alerts:** If any produce drops below **500kg**, the Director's chart automatically renders it in **RED**, and the frontend triggers visual warnings.
* **Credit vs. Cash Workflows:** Supports deferred payments with National ID and Due Date tracking for trusted buyers, alongside standard immediate cash sales.
* **Transaction Backdating:** A functional calendar module allows agents to log offline/delayed sales with accurate historical dates, ensuring financial reports remain perfectly accurate.

---

## 🛠️ Technology Stack

**Frontend (Client)**
* **Vue.js 3** (Composition API)
* **Vite** (Build Tool)
* **Vue Router** (Navigation & Route Guards)
* **Chart.js** (Data Visualization)
* **Custom CSS** (No external heavy UI libraries, ensuring maximum performance)

**Backend (Server)**
* **Node.js & Express.js**
* **MongoDB Atlas & Mongoose** (Database & ODM)
* **JSON Web Tokens (JWT)** (Stateless Authentication)
* **Bcrypt.js** (Password Hashing)

---

## 💻 Local Installation & Setup

If you wish to run this application locally, follow these steps:

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/godanaemiru/KGL-
\`\`\`

### 2. Setup the Backend
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` directory and add:
\`\`\`env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/karibu_kgl?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
\`\`\`
Run the database seeder to populate initial users, stock, and charts:
\`\`\`bash
node seeders/seed.js
npm run dev
\`\`\`

### 3. Setup the Frontend
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
\`\`\`
In `src/services/api.js`, ensure the `baseURL` points to your local server (`http://localhost:5000/api`).
\`\`\`bash
npm run dev
\`\`\`

---

