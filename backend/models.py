from pydantic import BaseModel, Field, field_validator
from typing import Literal

class Order(BaseModel):
    user_id: str
    side: Literal["YES", "NO"]
    action: Literal["BUY", "SELL"]
    price: float = Field(..., ge=0)
    quantity: int = Field(..., ge=1)

class Trade(BaseModel):
    buyer: str
    seller: str
    price: float
    quantity: int

    @field_validator("price")
    def check_price(cls, p):
        if p != 0 and not (1 <= p <= 99):
            raise ValueError("Limit order price must be 1-99, market order = 0")
