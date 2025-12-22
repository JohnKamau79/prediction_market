# Prediction Market

## Overview

- A simplified prediction market order matching engine, where users trade YES or NO contracts using BUY and SELL orders.The system matches orders using price-time priority, supports partial fills, and exposes an API plus a small frontend to demonstrate it.

- **Backend:** Python, FastAPI, Uvicorn
- **Frontend:** React, Axios
- **Focus:** Correctness, clarity, exchange mechanics, FIFO for priority first, matching logic, frontend integration

---

## Features

### Backend

- **Order Book Design:** Separate BUY (max-heap) and SELL (min-heap) queues for each market side
- **Order Matching:** Price-time priority, partial fills, market and limit orders
- **Validation:** Ensures price (1–99) for limit orders, quantity ≥ 1
- **APIs:**
  - `POST /order` – submit an order and return executed trades
  - `GET /orderbook` – return the current resting orders

### Frontend

- Simple trading dashboard with:
  - Order entry (User ID, side, action, price, quantity)
  - YES/NO markets displayed side-by-side with BUY/SELL tables
  - Recent trades section

## How to Run

### Backend

1. Install dependencies:
   python -m venv venv
   venv\Scripts\activate
   venv\Scripts\deactivate.bat
   pip install fastapi uvicorn
2. Run backend
   uvicorn main:app --reload

### Frontend

1. Install dependencies:
   npm install axios
2. Run frontend
   npm install
