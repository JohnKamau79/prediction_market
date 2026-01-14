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

    def match_order(self, order: Order):
        side = order.side
        price = order.price
        action = order.action
        user_id = order.user_id
        opposite_action = "SELL" if action == "BUY" else "BUY"

        executed_trades = []
        quantity_remaining = order.quantity

        with self.lock:  # Lock ensures thread safety
            heap = self.book[side][opposite_action]

            while quantity_remaining > 0 and heap:
                best_price, best_timestamp, best_order = heap[0]

                # Convert BUY heap negative price back
                if opposite_action == "BUY":
                    best_price = -best_price

                # Prevent self-matching
                if best_order["user_id"] == user_id:
                    break

                # Stop if limit order price does not cross
                if price != 0:
                    if (action == "BUY" and price < best_price) or (action == "SELL" and price > best_price):
                        break

                traded_qty = min(quantity_remaining, best_order["quantity"])
                if action == "BUY":
                    executed_trades.append({
                        "buyer": user_id,
                        "seller": best_order["user_id"],
                        "price": best_price,
                        "quantity": traded_qty
                    })
                else:  # SELL
                    executed_trades.append({
                        "buyer": best_order["user_id"],
                        "seller": user_id,
                        "price": best_price,
                        "quantity": traded_qty
                    })
                self.trade_history.append(executed_trades[-1])


                quantity_remaining -= traded_qty
                best_order["quantity"] -= traded_qty

                if best_order["quantity"] == 0:
                    heapq.heappop(heap)

            # Add remaining quantity to book if limit order
            if quantity_remaining > 0 and price != 0:
                order_to_add = {
                    "user_id": user_id,
                    "price": price,
                    "quantity": quantity_remaining,
                    "timestamp": time.time()
                }
                if action == "BUY":
                    heapq.heappush(self.book[side][action], (-price, order_to_add["timestamp"], order_to_add))
                else:
                    heapq.heappush(self.book[side][action], (price, order_to_add["timestamp"], order_to_add))

        return executed_trades

    def get_orderbook(self):
        return self.book
