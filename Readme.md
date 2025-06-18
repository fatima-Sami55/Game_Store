# 🎮 Game Store - Database Systems Project    ![MIT License](https://img.shields.io/badge/license-MIT-green.svg)

A database-driven e-commerce web application for buying and selling games online. Built as part of the Database Systems course at FAST NUCES.

## 👥 Team Members

- **Wajahat Ali**
- **Zaid Haris**
- **Fatima**

## 📌 Project Objective

The goal is to develop a Game Store platform with features like:

- User Authentication & Authorization
- Game Browsing and Filtering
- Shopping Cart & Order Placement
- Admin Dashboard for Inventory Management
- Secure Payment Processing
- Responsive UI with front-end and back-end integration

---

## 📦 Project Details

### ✅ Database Design & Setup

- Schema Design (Users, Games, Orders, Payments, Cart)
- Relationships and normalization up to 3NF
- SQL Queries for Table Creation
- Views, Indexes, Joins, and Triggers

### ✅ Basic UI Design

- Home, Product, Cart, and Checkout Pages
- Login/Register Forms with Input Validation
- Fully Responsive Layout

### ✅ User Authentication & Role-Based Access

- Signup & Login Functionality
- Role-based access (Customer vs Admin)
- Password Hashing & Security
- Backend Integration with Stored Procedures

### ✅ Core E-commerce Functionalities

- Dynamic Shopping Cart
- Order Placement and Inventory Update
- Simulated Payment System

### ✅ Final Application Integration & Testing

- Refined UI/UX
- Admin Inventory Management Panel
- Customer Order Tracking
- Testing and Debugging for Performance and Load

---

## 🛠️ Tech Stack

- **Front-end:** HTML, CSS, Bootstrap, JavaScript, EJS
- **Back-end:** Node.js, Express.js
- **Database:** SQL Server
- **Version Control:** Git & GitHub

---

## 🚀 Deployment

The application was successfully deployed on **Azure App Service** with a cloud-hosted **Azure SQL Database**.

### 🧩 Key Deployment Configurations:

- **Hosting Platform:** Microsoft Azure (App Service)
- **Database:** Azure SQL with firewall rules configured for remote access
- **Environment Variables:** Stored securely in Azure App Settings
- **Logging:** Enabled via Azure Log Stream for real-time debugging
- **Media Uploads:** Handled via `multer` for local image uploads; can be extended to Azure Blob Storage

> ⚠️ Note: Azure App Service does not support the `USE` SQL command for switching databases. A fresh DB connection must be made if accessing another DB.

---

## 🧾 License

This project is licensed under the [MIT License](./LICENSE) — feel free to use, modify, and distribute it.
