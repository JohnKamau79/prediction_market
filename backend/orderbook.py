import heapq
import time
from models import Order

class OrderBook:
    def __init__(self):
        self.book = {
            "YES": {"BUY": [], "SELL": []},
            "NO": {"BUY": [], "SELL": []}
        }

    def match_order(self, order: Order):
        side = order.side
        action = order.action
        opposite_action = "SELL" if action == "BUY" else "BUY"
        heap = self.book[side][opposite_action]

        executed_trades = []
        quantity_remaining = order.quantity

        while quantity_remaining > 0 and heap:
            best_price, best_timestamp, best_order = heap[0]

            if opposite_action == "BUY":
                best_price = -best_price

            # Stop if prices do not cross
            if order.price != 0:
                if (action == "BUY" and order.price < best_price) or (action == "SELL" and order.price > best_price):
                    break

            traded_qty = min(quantity_remaining, best_order["quantity"])
            executed_trades.append({
                "buyer": order.user_id if action == "BUY" else best_order["user_id"],
                "seller": best_order["user_id"] if action == "SELL" else order.user_id,
                "price": best_price,
                "quantity": traded_qty
            })

            quantity_remaining -= traded_qty
            best_order["quantity"] -= traded_qty

            if best_order["quantity"] == 0:
                heapq.heappop(heap)

        # Add remaining quantity to book if limit order
        if quantity_remaining > 0 and order.price != 0:
            order_to_add = {
                "user_id": order.user_id,
                "price": order.price,
                "quantity": quantity_remaining,
                "timestamp": time.time()
            }
            if action == "BUY":
                heapq.heappush(self.book[side][action], (-order.price, order_to_add["timestamp"], order_to_add))
            else:
                heapq.heappush(self.book[side][action], (order.price, order_to_add["timestamp"], order_to_add))

        return executed_trades

    def get_orderbook(self):
        return self.book
