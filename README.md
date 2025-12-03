# Online Shopping Nepal

A shopping cart application built with Laravel and React. Browse products, add items to cart, and apply discount codes.

## Features

- Browse products from Fake Store API
- Search products by name
- Add/remove items from cart
- Apply discount codes (CODE10 for 10% off, CODE20 for 20% off)
- Mobile responsive design

## Requirements

- PHP 8.2+
- Composer
- Node.js and npm

## Setup

1. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   ```

3. **Run the application**
   ```bash
   composer run dev
   ```

## Access

Open your browser to: `http://127.0.0.1:8000`

## Usage

- Browse and search products
- Click "Add to Cart" to add items
- Use discount codes: CODE10 or CODE20
- Manage cart quantities in the sidebar

## Solving Errors

- Make sure that the essential drivers in php.ini are unlocked:
ex: extension=pdo_sqlite
    extension=sqlite3
