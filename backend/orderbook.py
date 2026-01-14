import heapq
import time
import threading
from models import Order

class OrderBook:
    def __init__(self):
        self.book = {
            "YES": {"BUY": [], "SELL": []},
            "NO": {"BUY": [], "SELL": []}
        }
        self.lock = threading.Lock()
        self.trade_history = []
        # Initialize prices
        self.prices = {"YES": 50.0, "NO": 50.0}

    def match_order(self, order: Order):
        action = order.action
        side = order.side  # "YES" or "NO"
        user_id = order.user_id
        price = order.price
        quantity_remaining = order.quantity
        opposite_side = "NO" if side == "YES" else "YES"

        executed_trades = []

        with self.lock:
            heap = self.book[opposite_side][ "BUY" if action == "SELL" else "SELL" ]

            while quantity_remaining > 0 and heap:
                best_price, best_timestamp, best_order = heap[0]

                if opposite_side == "YES" and best_order["price"] < 0:  # BUY heap
                    best_price = -best_price

                # Prevent self-matching
                if best_order["user_id"] == user_id:
                    break

                # Stop if limit order price does not cross
                if price != 0:
                    if (action == "BUY" and price < best_price) or (action == "SELL" and price > best_price):
                        break

                traded_qty = min(quantity_remaining, best_order["quantity"])

                # Assign buyer and seller
                if action == "BUY":
                    buyer = user_id
                    seller = best_order["user_id"]
                else:
                    buyer = best_order["user_id"]
                    seller = user_id

                executed_trades.append({
                    "buyer": buyer,
                    "seller": seller,
                    "side": side,
                    "price": best_price,
                    "quantity": traded_qty
                })
                self.trade_history.append(executed_trades[-1])

                quantity_remaining -= traded_qty
                best_order["quantity"] -= traded_qty

                if best_order["quantity"] == 0:
                    heapq.heappop(heap)

                # Update market prices to enforce YES + NO = 100
                self.prices[side] = best_price
                self.prices[opposite_side] = 100 - best_price

            # Add remaining quantity to book if limit order
            if quantity_remaining > 0 and price != 0:
                order_to_add = {
                    "user_id": user_id,
                    "price": price,
                    "quantity": quantity_remaining,
                    "timestamp": time.time()
                }
                heap_side = self.book[side][action]
                if action == "BUY":
                    heapq.heappush(heap_side, (-price, order_to_add["timestamp"], order_to_add))
                else:
                    heapq.heappush(heap_side, (price, order_to_add["timestamp"], order_to_add))

        return executed_trades

    def get_orderbook(self):
        return self.book

    def get_prices(self):
        return self.prices