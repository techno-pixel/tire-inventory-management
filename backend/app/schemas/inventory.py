from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class InventoryItemBase(BaseModel):
    name: str
    sku: str
    quantity: int
    price: Optional[float] = None  # Unified to `cost`
    brand: Optional[str] = None
    model: Optional[str] = None
    size: Optional[str] = None
    type: Optional[str] = None
    location: Optional[str] = None
    minimum_stock: Optional[int] = None
    season: Optional[str] = None
    speed_rating: Optional[str] = None
    load_index: Optional[str] = None
    dot: Optional[str] = None
    image_url: Optional[str] = None
    notes: Optional[str] = None
    warranty_months: Optional[int] = None
    manufacture_date: Optional[datetime] = None
    tread_depth: Optional[float] = None
    weight: Optional[float] = None

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItem(InventoryItemBase):
    id: int
    last_updated: datetime
    user_id: int

    class Config:
        orm_mode = True
