from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InventoryItemBase(BaseModel):
    name: str
    sku: str
    quantity: int
    price: float
    brand: Optional[str] = None
    size: Optional[str] = None
    type: Optional[str] = None
    location: Optional[str] = None
    minimum_stock: Optional[int] = None

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItem(InventoryItemBase):
    id: int
    last_updated: datetime
    user_id: int

    class Config:
        from_attributes = True
