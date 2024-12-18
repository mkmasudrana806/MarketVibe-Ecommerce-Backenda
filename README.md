# EasyShop-Ecommerce-Backend

## Important Links

1. **Live Deployment Link Backend:**

- [Live Server](https://market-vibe-ecommerce-backend.vercel.app/)

2. **GitHub Repository Link Backend:**

- [GitHub Repository](https://github.com/mkmasudrana806/MarketVibe-Ecommerce-Backenda)

3. **Live Deployment Link Client:**

- [Live Client](https://easy-shop-ecommerce-client.vercel.app/)

## Overview

`EasyShop` is a `Multi-vendor` Ecommerce backend application designed to manage various entities and processes related to an Ecommerce application. it uses well-structured REST API with CRUD operation and so on. The project provides comprehensive functionality for managing different user types like public, user, vendor and admin. also authorization, services, and operations within the system.

The main focus of this project is to implement modules pattern, QueryBuilder, vast Error Handling, CRUD operations, Authentication & Authorization, Transaction & Rollback, email sending using nodemailer and static files upload to server and image upload to cloudinary.

## Features

- **User Management:** Register, login, buy products, payment, transaction history and role-based access control.

- **Authentication:** Secure user authentication using JWT for login, forgot password, reset password, registration, and token management.

- **Products, Orders, Reviews, Coupons, Vendors, Categories, Payments and User Management**

1.  User has access to all the public resources
2.  Vendor has access to it's product, payment, orders, review, coupons management
3.  Admin has control over the platform ( user, vendor).

## API’s Endpoints

- **Entry Point** `http://localhost:5000/api`

### Auth:

- **POST** `/auth/login` - Log in a user.
- **POST** `/auth/change-password` - Change user password (user, admin).
- **POST** `/auth/forgot-password` - Forgot user password.
- **POST** `/auth/reset-password` - Reset user password.
- **POST** `/auth/refresh-token` - Refresh user token.

### User:

- **POST** `/users/create-user` - Create a user.
- **GET** `/users/` - Get all users (admin).
- **GET** `/users/me` - Get user profile (user, admin, vendor).
- **DELETE** `/users/:id` - Delete a user (admin).
- **PATCH** `/users/` - Update a user (user, admin, vendor).
- **PATCH** `/users/change-status/:id` - Change user status (admin).

### Vendor:

- **POST** `/vendors/create-vendor` - Create a new vendor.
- **GET** `/vendors/` - Get all vendors (admin).
- **GET** `/vendors/:id` - Get a single vendor.
- **DELETE** `/vendors/:id` - Delete a vendor (admin).
- **PUT** `/vendors/:id` - Update vendor (vendor).
- **PATCH** `/vendors/follow-unfollow/:id` - Follow/unfollow a vendor (user).
- **PATCH** `/vendors/change-status/:id` - Change vendor status (admin).

### Product:

- **POST** `/products/create-product` - Create a new product (vendor).
- **GET** `/products/` - Get all products.
- **GET** `/products/:id` - Get a single product by ID.
- **DELETE** `/products/:id` - Delete a product (vendor, admin).
- **PUT** `/products/:id` - Update a product (vendor).

### Categories:

- **POST** `/categories/create-category` - Create a new category (admin).
- **GET** `/categories/` - Get all categories (admin).
- **GET** `/categories/public` - Get all public categories.
- **GET** `/categories/:id` - Get a single category by ID.
- **PATCH** `/categories/:id` - Update a category (admin).
- **DELETE** `/categories/:id` - Delete a category (admin).

### Order:

- **POST** `/orders/create-order` - Create a new order (user).
- **GET** `/orders/` - Get all orders (admin).
- **GET** `/orders/user-orders` - Get all orders for a user (user).
- **GET** `/orders/vendor-orders` - Get all orders for a vendor (vendor).
- **PATCH** `/orders/payment-status/:id` - Update order payment status (vendor).
- **PATCH** `/orders/order-status/:id` - Update order status (vendor).

### Payment:

- **POST** `/payments/make-payment` - Make a payment.
- **GET** `/payments/` - Get all payments history (admin).
- **GET** `/payments/user-payments` - Get user payments history (user).
- **GET** `/payments/vendor-payments` - Get vendor payments history (vendor).

### Coupon:

- **POST** `/coupons/create-coupon` - Create a coupon (vendor, admin).
- **GET** `/coupons/all` - Get all coupons (admin).
- **GET** `/coupons/vendor` - Get vendor-specific coupons (vendor).

### Review:

- **POST** `/reviews/create-review` - Create a review (user).
- **GET** `/reviews/user-reviews` - Get user reviews (user).
- **GET** `/reviews/vendor-reviews` - Get vendor reviews (vendor).
- **DELETE** `/reviews/:id` - Delete a review (user, admin).
- **PATCH** `/reviews/:id` - Update a review (user).

## Installation

### Pre Requisites

- Must have Nodejs and Typescript installed on your machine.
- replace (if origin is other than localhost) `origin: "https://easy-shop-ecommerce-client.vercel.app/",` with your client side link as origin in app.ts file

To get the project up and running locally, follow these steps:

`Note:` before running the application, please include .env file root of your project. below is given instructions of it.

1. **Clone the repository:**

```bash
git clone https://github.com/mkmasudrana806/MarketVibe-Ecommerce-Backenda.git
cd MarketVibe-Ecommerce-Backenda
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Build the project:**

```bash
tsc
```

4. **Start the development server:**

```bash
npm start
```

## Environment Variables

Create a .env file in the root of the project and add your variables. .env.example demo is given root of your project. do the same things with original information

## Usage

Download this postman collectino file. import it into your postman then test the application

- [Download Link](https://drive.google.com/file/d/11jfEEB50-Ug0fFhhRE56TKatRuKrjzf2/view?usp=sharing)

## Technology Stack:

- Node.js
- TypeScript
- Express.js
- MongoDB
- Mongoose
- JWT
- Zod Validation
- bcrypt
- Nodemailer
- Cloudinary

## Project Structure

**builders/** a query builder class including some methods like search, filter, limit, pagination, fileds limiting and query meta data

**errors/** all errors handler methods like CastError, duplicate entry error, zod errors, mongoose validation error

**interface/** contains error.ts file, which contains error types and index.ts contains Request interface

**middlewares/** auth, globalErrorHandler, notFound, validateRequestData middlewares

**modules/** contains all models like user, auth, Product, Order, Payment, Review, Category, Coupon and Vendor. each module contains routes, controller, service, validation, constants, model and utils files

**routes/** Centralized route management for the API.

**utils/** Utility functions and helpers like appError, asyncHandler, sendResponse and so on.

**app.ts** The main entry point of the application.

**server.ts** Application database connection and server configuration

## Error Handling:

### **1\. No Data Found:**

When retrieving data, if the database collection is empty or no matching data is found, return the message: "No data found."

```elixir
{
  "success": false,
  "statusCode": 404,
  "message": "No Data Found",
  "data":[]
}
```

### **2. Error Handling:**

Implement proper error handling throughout the application. Use global error handling `middleware` to catch and handle errors, providing appropriate error responses with error messages.

**Error Response Object Should include the following properties:**

- success → false
- message → Error Type → Validation Error, Cast Error, Duplicate Entry
- errorMessages
- stack

**Sample Error Response**

```swift
   {
    "success": false,
    "message": "E11000 duplicate key error collection: univerity-management.students index: email_1 dup key: { email: \\"user2@gmail.com\\" }",
    "errorMessages": [
        {
            "path": "",
            "message": "E11000 duplicate key error collection: univerity-management.students index: email_1 dup key: { email: \\"user2@gmail.com\\" }"
        }
    ],
    "stack": "MongoServerError: E11000 duplicate key error collection: univerity-management.students index: email_1 dup key: { email: \\"user2@gmail.com\\" }\\n    at H:\\\\next-level-development\\\\university-management-auth-service\\\\node_modules\\\\mongodb\\\\src\\\\operations\\\\insert.ts:85:25\\n    at H:\\\\next-level-development\\\\university-management-auth-service\\\\node_modules\\\\mongodb\\\\src\\\\cmap\\\\connection_pool.ts:574:11\\n    at H:\\\\next-level-development\\\\university-writeOrBuffer (node:internal/streams/writable:391:12)"
}
```

### **3\. Not Found Route:**

Implement a global "Not Found" handler for unmatched routes. When a route is not found, respond with a generic message: "Not Found.”

```json
{
  "success": false,
  "statusCode": 404,
  "message": "API Not Found"
}
```

### **5\. Zod Validation:**

The API employs Zod for input validation, ensuring data consistency. When validation fails, a 400 Bad Request status code is returned, accompanied by detailed error messages specifying the erroneous fields and reasons.

---

###
