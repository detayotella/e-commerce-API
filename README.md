# E-Commerce API

This is a full-fledged **E-Commerce API** built with **TypeScript**, **Prisma**, and **Express**. It supports essential e-commerce functionalities like user authentication, product management, cart, order creation, and order tracking. The API is designed to allow users to perform CRUD operations on various e-commerce resources, such as products, orders, and cart items.

## Features

- **User Management**: 
  - User registration and authentication with JWT tokens.
  - Role-based access control with `ADMIN` and `USER` roles.
  
- **Product Management**:
  - CRUD operations for products (create, read, update, delete).
  
- **Cart Management**:
  - Add, update, and remove items in the cart.
  
- **Order Management**:
  - Place orders with multiple products.
  - Track order status and history.
  
- **Address Management**:
  - Add, update, and retrieve user addresses.

## Technologies Used

- **TypeScript**: A strongly typed superset of JavaScript.
- **Prisma ORM**: A modern database toolkit to interact with the database.
- **Express.js**: A minimal web application framework for Node.js.
- **PostgreSQL**: The relational database for storing user, product, and order data.
- **JWT (JSON Web Token)**: For secure authentication and authorization.
- **Zod**: A schema validation library for runtime validation and error handling.
- **Nodemon**: For automatic server restarts during development.

## Setup and Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/e-commerce-api.git
   cd e-commerce-api
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root of your project and add the following variables:

   ```env
   DATABASE_URL=your-database-url
   JWT_SECRET=your-jwt-secret
   ```

4. **Set up the database**:

   - Make sure you have PostgreSQL installed and running.
   - Run the Prisma migrations to set up your database schema:

     ```bash
     npx prisma migrate dev
     ```

5. **Run the development server**:

   For development, you can use `nodemon` to watch for file changes and automatically restart the server:

   ```bash
   npm run dev
   ```

   For production, compile TypeScript to JavaScript and run the app:

   ```bash
   npm run build
   npm start
   ```

## API Endpoints

Here are the main API endpoints available in the project:

### Authentication

- **POST /auth/register**: Register a new user.
- **POST /auth/login**: Login and obtain a JWT token.
- **GET /auth/me:** Login and display the authenticated user. 

### User

- **GET /users**: List all users (Admin only).
- **GET /users/:id**: Get a user by ID.
- **PUT /users/:id/role**: Change the role of a user (Admin only).
- **POST /users/address**: Add user address. 
- **GET /users/**: Get all users 
- **GET /users/**: List all the addresses of the user.

### Product

- **GET /products**: List all products.
- **GET /products/:id**: Get a product by ID.
- **POST /products**: Create a new product (Admin only).
- **PUT /products/:id**: Update a product (Admin only).
- **DELETE /products/:id**: Delete a product (Admin only).
- **GET /products/search**: Search for product

### Cart

- **GET /cart**: List all items in the user's cart.
- **POST /cart**: Add a product to the cart.
- **PUT /cart/:id**: Update the quantity of an item in the cart.
- **DELETE /cart/:id**: Remove an item from the cart.

### Order

- **GET /orders/index**: List all orders for the authenticated user.
- **GET /orders/:id**: Get details of an order by ID.
- **POST /orders**: Create a new order from cart items.
- **PUT /orders/:id/cancel**:  Cancel the order.
- **PUT /orders/:id/status**: Change the status of the order. 
- **GET /orders/:id**: Get the order by ID. 

### Address

- **GET /addresses**: Get all addresses for the authenticated user.
- **POST /addresses**: Add a new address.
- **PUT /addresses/:id**: Update an address.
- **DELETE /addresses/:id**: Delete an address.


## Project Structure

```bash
e-commerce-api/
├── dist/                    # Compiled JavaScript files for production
├── node_modules/            # Installed dependencies
├── prisma/                  # Prisma schema and migration files
├── src/                     # Source TypeScript files
│   ├── controllers/         # API endpoint logic for handling requests
│   ├── exceptions/          # Custom error classes and exceptions
│   ├── middlewares/         # Custom middlewares (e.g., authentication, logging)
│   ├── routes/              # Express route definitions and API endpoints
│   ├── schema/              # Validation schemas defined with Zod for runtime validation
│   ├── types/               # Custom TypeScript types and extended types for the app
│   ├── errorHandlers/       # Centralized error-handling utilities
│   └── index.ts             # Main entry point to start the application
│   └── secrets.ts           # Handles access to environment variables securely
├── .env                     # Environment variable configuration file
├── tsconfig.json            # TypeScript configuration file
├── package.json             # Project metadata and dependency information
└── README.md                # Project documentation and usage guide
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

