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
    price = Column(Float, nullable=True)  # Unified to `cost`
    brand = Column(String, nullable=True)
    model = Column(String, nullable=True)
    size = Column(String, nullable=True)
    type = Column(String, nullable=True)
    location = Column(String, nullable=True)
    minimum_stock = Column(Integer, nullable=True)
    season = Column(String, nullable=True)
    speed_rating = Column(String, nullable=True)
    load_index = Column(String, nullable=True)
    dot = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    warranty_months = Column(Integer, nullable=True)
    manufacture_date = Column(DateTime, nullable=True)
    tread_depth = Column(Float, nullable=True)
    weight = Column(Float, nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="items")
