# models/inventory.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    sku = Column(String, unique=True, index=True)
    quantity = Column(Integer)
    price = Column(Float)
    brand = Column(String, nullable=True)
    size = Column(String, nullable=True)
    type = Column(String, nullable=True)
    location = Column(String, nullable=True)
    minimum_stock = Column(Integer, nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="items")