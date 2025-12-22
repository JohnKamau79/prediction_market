from fastapi import FastAPI
from models import Order
from orderbook import OrderBook
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
orderbook = OrderBook()

origins = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/order')
def submit_order(order: Order):
    trades = orderbook.match_order(order)
    return {
        'trades': trades
    }
    
@app.get('/orderbook')
def get_orderbook():
    return orderbook.get_orderbook()