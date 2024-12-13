from sqlalchemy.orm import Session
from ..models.inventory import InventoryItem
from ..schemas.inventory import InventoryItemCreate
from typing import List, Optional

def get_inventory_items(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    user_id: Optional[int] = None
) -> List[InventoryItem]:
    query = db.query(InventoryItem)
    if user_id is not None:
        query = query.filter(InventoryItem.user_id == user_id)
    return query.offset(skip).limit(limit).all()

def get_inventory_item(
    db: Session, 
    item_id: int,
    user_id: Optional[int] = None
) -> Optional[InventoryItem]:
    query = db.query(InventoryItem).filter(InventoryItem.id == item_id)
    if user_id is not None:
        query = query.filter(InventoryItem.user_id == user_id)
    return query.first()

def create_inventory_item(
    db: Session, 
    item: InventoryItemCreate, 
    user_id: int
) -> InventoryItem:
    db_item = InventoryItem(**item.model_dump(), user_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_inventory_item(
    db: Session,
    item_id: int,
    item_data: InventoryItemCreate,
    user_id: Optional[int] = None
) -> Optional[InventoryItem]:
    query = db.query(InventoryItem).filter(InventoryItem.id == item_id)
    if user_id is not None:
        query = query.filter(InventoryItem.user_id == user_id)
    db_item = query.first()
    
    if db_item is None:
        return None
        
    for key, value in item_data.model_dump().items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_inventory_item(
    db: Session, 
    item_id: int,
    user_id: Optional[int] = None
) -> bool:
    query = db.query(InventoryItem).filter(InventoryItem.id == item_id)
    if user_id is not None:
        query = query.filter(InventoryItem.user_id == user_id)
    db_item = query.first()
    
    if db_item is None:
        return False
        
    db.delete(db_item)
    db.commit()
    return True
