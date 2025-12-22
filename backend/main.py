from fastapi import FastAPI
from models import Order
from orderbook import OrderBook

app = FastAPI()
orderbook = OrderBook()

@app.post('/order')
def submit_order(order: Order):
    trades = orderbook.match_order(order)
    return {
        'trades': trades
    }
    
@app.get('/orderbook')
def get_orderbook():
    return orderbook.get_orderbook()