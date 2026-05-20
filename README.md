# Toriventy — Inventory Management System

A production-style academic Inventory Management System built with a **Vanilla PHP REST API** backend and a **React SPA** frontend. The system features JWT-based stateless authentication, AES-256-GCM encryption for sensitive user data, and a MySQL stored-procedure-driven data layer.

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Security Implementation](#security-implementation)
- [Frontend Panels (User Manual)](#frontend-panels-user-manual)
- [Troubleshooting](#troubleshooting)

---

## System Architecture

```
┌─────────────────────┐         HTTP/JSON          ┌─────────────────────────┐
│                     │ ◄──────────────────────────►│                         │
│   React SPA         │    JWT in Authorization     │   Vanilla PHP API       │
│   (Vite + React 19) │    header for all           │   (MVC-Inspired)        │
│   Port: 5173        │    protected routes         │   Port: 80 (Apache)     │
│                     │                             │                         │
└─────────────────────┘                             └────────────┬────────────┘
                                                                 │
                                                                 │ PDO (MySQL)
                                                                 │
                                                    ┌────────────▼────────────┐
                                                    │                         │
                                                    │   MySQL 8.x            │
                                                    │   toriventy_db          │
                                                    │   (Stored Procedures)   │
                                                    │                         │
                                                    └─────────────────────────┘
```

All database operations are executed exclusively through **MySQL Stored Procedures** — no raw SQL queries exist in the controller layer. This acts as a microservice-like abstraction between the application logic and the data layer.

---

## Technology Stack

| Layer        | Technology                                           |
|--------------|------------------------------------------------------|
| **Frontend** | React 19, React Router 7, Vite 8, Vanilla CSS       |
| **Backend**  | Vanilla PHP (no framework), Composer, PSR-4 Autoload |
| **Database** | MySQL 8.x via Laragon                                |
| **Auth**     | Stateless JWT (`firebase/php-jwt`)                   |
| **Encryption** | AES-256-GCM via PHP `openssl_encrypt` / `openssl_decrypt` |
| **Env**      | `vlucas/phpdotenv`                                   |

---

## Project Structure

```
Toriventy/
├── backend/                        # PHP REST API
│   ├── app/
│   │   ├── Config/
│   │   │   └── Config.php          # Environment variable loader
│   │   ├── Controllers/
│   │   │   ├── AuthController.php  # Register & Login
│   │   │   ├── UserController.php  # Profile (GET/PUT)
│   │   │   ├── ProductController.php
│   │   │   ├── StockController.php
│   │   │   ├── SupplierController.php
│   │   │   └── ReportController.php
│   │   ├── Core/
│   │   │   ├── Database.php        # PDO singleton
│   │   │   └── Router.php          # Custom regex router
│   │   ├── Helpers/
│   │   │   ├── EncryptionHelper.php # AES-256-GCM + HMAC
│   │   │   └── ResponseHelper.php   # JSON response standardizer
│   │   └── Middleware/
│   │       └── AuthMiddleware.php   # JWT verification
│   ├── public/
│   │   ├── index.php               # Application entry point
│   │   └── .htaccess               # Apache rewrite rules
│   ├── routes/
│   │   └── api.php                 # All API route definitions
│   ├── .env                        # Environment secrets
│   ├── composer.json
│   └── database.sql                # Full schema + stored procedures
│
├── frontend/                       # React SPA
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js            # Fetch wrapper with JWT injection
│   │   ├── components/
│   │   │   ├── AuthForm.jsx        # Reusable auth form components
│   │   │   ├── AuthStyles.js       # Auth page inline styles
│   │   │   └── ProtectedRoute.jsx  # Route guard (token + role check)
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── DashboardPage.jsx   # Main app shell with all panels
│   │   ├── App.jsx                 # Route definitions
│   │   └── main.jsx                # React entry point
│   ├── .env                        # VITE_API_URL
│   └── package.json
│
└── README.md                       # This file
```

---

## Prerequisites

| Software   | Version    | Purpose                   |
|------------|------------|---------------------------|
| **Laragon** | Latest    | Apache + MySQL + PHP      |
| **PHP**    | ≥ 7.4      | Backend runtime           |
| **MySQL**  | 8.x        | Database engine           |
| **Composer** | Latest   | PHP dependency management |
| **Node.js** | ≥ 18      | Frontend build tooling    |
| **npm**    | ≥ 9        | Package management        |

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url> D:\laragon\www\Toriventy
```

### 2. Install Backend Dependencies

```bash
cd D:\laragon\www\Toriventy\backend
composer install
```

### 3. Install Frontend Dependencies

```bash
cd D:\laragon\www\Toriventy\frontend
npm install
```

---

## Environment Configuration

### Backend (`backend/.env`)

Create or verify the file `backend/.env` with the following variables:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=toriventy_db
DB_USERNAME=root
DB_PASSWORD=

# 32 bytes (64 hex characters) — AES-256-GCM encryption key
ENCRYPTION_KEY=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# HMAC key (used internally by EncryptionHelper)
BLIND_INDEX_KEY=blind_secret_key_123!

# JWT authentication
JWT_SECRET=super_secret_jwt_key_toriventy
JWT_EXPIRATION=7200
```

> **⚠️ Important:** In a production environment, replace all keys and secrets with cryptographically random values. Never commit `.env` to version control.

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost/Toriventy/backend/public/api
```

---

## Database Setup

### Option A: Import via Command Line

```bash
mysql -u root toriventy_db < D:\laragon\www\Toriventy\backend\database.sql
```

### Option B: Import via HeidiSQL / phpMyAdmin

1. Open Laragon → Database (HeidiSQL)
2. Create a new database: `toriventy_db` (charset: `utf8mb4`, collation: `utf8mb4_unicode_ci`)
3. Open `backend/database.sql` and execute the full script

### Database Schema

| Table              | Description                              |
|--------------------|------------------------------------------|
| `tbl_users`        | User accounts (email, encrypted phone)   |
| `tbl_suppliers`    | Supplier contact information             |
| `tbl_products`     | Product catalog with supplier FK         |
| `tbl_stock`        | Current inventory levels per product     |
| `tbl_stock_logs`   | Audit trail of all stock changes         |

### Stored Procedures

| Procedure                  | Used By              | Purpose                              |
|----------------------------|----------------------|--------------------------------------|
| `registerUser`             | `POST /auth/register` | Insert new user                     |
| `getUserByEmail`           | `POST /auth/login`    | Lookup user by email for login      |
| `getUserById`              | `GET /users/profile`  | Fetch user by ID                    |
| `updateUserProfile`        | `PUT /users/profile`  | Update username, email, phone       |
| `getProducts`              | `GET /products`       | List all products with supplier info|
| `getProductById`           | `GET /products/{id}`  | Single product detail               |
| `insertProduct`            | `POST /products`      | Create product + initialize stock   |
| `getStockLevels`           | `GET /stock`          | All stock levels with status        |
| `getStockByProduct`        | `GET /stock/{id}`     | Stock for a specific product        |
| `updateStock`              | `POST /stock/update`  | Adjust quantity (+ or -)            |
| `getLowStock`              | `GET /reports/low-stock` | Items at or below threshold      |
| `getSupplierInformation`   | `GET /admin/suppliers` | List all suppliers                  |
| `insertSupplierInformation`| —                     | Add new supplier                    |
| `updateSupplier`           | —                     | Edit supplier details               |
| `deleteSupplier`           | —                     | Remove a supplier                   |

---

## Running the Application

### 1. Start Laragon

Open Laragon and ensure **Apache** and **MySQL** are both running (green indicators).

### 2. Start the Frontend Dev Server

```bash
cd D:\laragon\www\Toriventy\frontend
npm run dev
```

The React app will be available at: **http://localhost:5173**

### 3. Access the Application

| URL                          | Description           |
|------------------------------|-----------------------|
| `http://localhost:5173`      | Frontend (React SPA)  |
| `http://localhost:5173/login` | Login page           |
| `http://localhost:5173/signup` | Registration page   |
| `http://localhost:5173/dashboard` | Main dashboard   |

The backend API is served by Laragon's Apache at:
`http://localhost/Toriventy/backend/public/api/...`

---

## API Reference

All protected endpoints require the header: `Authorization: Bearer <JWT_TOKEN>`

### Authentication

| Method | Endpoint              | Auth | Description                |
|--------|-----------------------|------|----------------------------|
| POST   | `/api/auth/register`  | No   | Create a new user account  |
| POST   | `/api/auth/login`     | No   | Authenticate and get JWT   |

**Register Request Body:**
```json
{
  "username": "John Doe",
  "email": "john@example.com",
  "phone": "09171234567",
  "password": "MySecure123!"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "MySecure123!"
}
```

**Login Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOi...",
    "user": {
      "fld_user_id": 1,
      "fld_username": "John Doe",
      "fld_email": "john@example.com",
      "fld_phone": "09171234567",
      "fld_role": "admin"
    }
  }
}
```

### Profile & User Management

| Method | Endpoint             | Auth | Description           |
|--------|----------------------|------|-----------------------|
| GET    | `/api/users/profile` | Yes  | Get current user info |
| PUT    | `/api/users/profile` | Yes  | Update profile fields |

### Products

| Method | Endpoint              | Auth | Role  | Description         |
|--------|-----------------------|------|-------|---------------------|
| GET    | `/api/products`       | Yes  | Any   | List all products   |
| GET    | `/api/products/{id}`  | Yes  | Any   | Get product detail  |
| POST   | `/api/products`       | Yes  | Admin | Create new product  |

**Create Product Request Body:**
```json
{
  "supplier_id": 1,
  "name": "Wireless Mouse",
  "sku": "WM-001",
  "description": "Ergonomic wireless mouse",
  "price": 1412.00,
  "low_stock_threshold": 10
}
```

### Stock

| Method | Endpoint              | Auth | Description                  |
|--------|-----------------------|------|------------------------------|
| GET    | `/api/stock`          | Yes  | All stock levels             |
| GET    | `/api/stock/{id}`     | Yes  | Stock for a specific product |
| POST   | `/api/stock/update`   | Yes  | Adjust stock quantity        |

**Stock Update Request Body:**
```json
{
  "product_id": 1,
  "quantity_change": 50,
  "reason": "New shipment received"
}
```
> Use negative values for stock removals (e.g., `-10`). The stored procedure will reject if the resulting quantity goes below zero.

### Admin & Reporting

| Method | Endpoint                    | Auth | Description                         |
|--------|-----------------------------|------|-------------------------------------|
| GET    | `/api/admin/products`       | Yes  | List all products (admin view)      |
| GET    | `/api/admin/suppliers`      | Yes  | List all suppliers                  |
| GET    | `/api/reports/stock-levels` | Yes  | Full stock report with status flags |
| GET    | `/api/reports/low-stock`    | Yes  | Items at or below reorder threshold |

---

## Security Implementation

### Authentication Flow

1. User submits email + password to `POST /api/auth/login`
2. Backend looks up user by plaintext email via `getUserByEmail` stored procedure
3. Password is verified using PHP's `password_verify()` against the `bcrypt` hash
4. On success, a JWT is generated with `user_id`, `role`, and `username` in the payload
5. Frontend stores the JWT in `localStorage` and attaches it to all subsequent requests via the `Authorization: Bearer` header
6. The `AuthMiddleware` decodes and validates the JWT on every protected route

### Encryption (AES-256-GCM)

The `fld_phone` field in `tbl_users` is encrypted at rest using AES-256-GCM:

- **Algorithm:** `aes-256-gcm` via PHP's `openssl_encrypt()`
- **Key:** 256-bit key stored as hex in the `ENCRYPTION_KEY` environment variable
- **IV:** A cryptographically random initialization vector generated per encryption
- **Auth Tag:** GCM produces an authentication tag to ensure data integrity
- **Storage Format:** Base64-encoded JSON containing the ciphertext, IV, and tag

```
Plaintext → openssl_encrypt(AES-256-GCM) → { v: ciphertext, i: iv, t: tag } → Base64
```

### Password Hashing

All passwords are hashed using PHP's `password_hash()` with the `PASSWORD_DEFAULT` algorithm (bcrypt). Passwords are never stored in plaintext.

### Role-Based Access Control

| Role    | Permissions                                           |
|---------|-------------------------------------------------------|
| `admin` | Full access: create products, view suppliers, reports |
| `user`  | View products, stock levels, own profile management   |

The `ProtectedRoute` component on the frontend checks `localStorage` for a valid token and role before rendering protected pages.

---

## Frontend Panels (User Manual)

After logging in, the user lands on the **Dashboard** — a single-page layout with a dark sidebar and content area. Click the sidebar items to navigate between panels.

### Dashboard Panel
Displays three real-time metric cards:
- **Total Products** — count of all products in the catalog
- **Active Suppliers** — count of registered suppliers
- **Low Stock Items** — count of items at or below their reorder threshold

### Products Panel
- View a searchable table of all products with name, SKU, price, supplier, and quantity
- **Admin users** see an "**+ Add Product**" button to create new products with supplier ID, name, SKU, price, description, and low stock threshold

### Suppliers Panel
- View a table listing all supplier contacts: ID, name, phone, email, and address
- Visible to admin users

### Stocks Panel
- View all current stock levels with quantity, threshold, and status badges (**In Stock**, **Low Stock**, **Out of Stock**)
- Click "**Update Stock**" to adjust quantity for any product by entering the Product ID, quantity change (positive for additions, negative for removals), and a reason

### Reports Panel
- Toggle between two views:
  - **All Stock Levels** — complete inventory report with status indicators
  - **Low Stock Alert** — filtered view showing only items at or below threshold, including the supplier name for quick reordering decisions

### Profile Panel
- View and edit your account information: username, email, and phone number
- Changes are saved to the database with phone re-encrypted automatically

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| **CORS errors** | Ensure Laragon's Apache is running. CORS headers are set in `backend/public/index.php`. |
| **404 on API calls** | Verify `VITE_API_URL` in `frontend/.env` points to `http://localhost/Toriventy/backend/public/api`. Restart the Vite dev server after changing `.env`. |
| **Collation errors** | Run: `ALTER DATABASE toriventy_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;` and re-import `database.sql`. |
| **"Class not found"** | Run `composer dump-autoload` in the `backend/` directory. |
| **Login doesn't navigate** | Check browser console for API errors. Ensure the user exists in `tbl_users` — register first via `/signup`. |
| **Encryption key errors** | Verify `ENCRYPTION_KEY` in `backend/.env` is exactly 64 hex characters (32 bytes). |

---
