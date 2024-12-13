from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database import get_db
from ..models.inventory import InventoryItem
from ..utils.security import verify_token
from datetime import datetime, timedelta
from typing import Dict, Any
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.get("/dashboard-metrics")
async def get_dashboard_metrics(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> Dict[str, Any]:
    # Verify token
    token_data = await verify_token(token)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Get total inventory count
    total_inventory = db.query(func.sum(InventoryItem.quantity)).scalar() or 0
    
    # Get low stock items count
    low_stock_items = db.query(InventoryItem).filter(
        InventoryItem.quantity <= InventoryItem.minimum_stock
    ).count()
    
    # Basic metrics for now
    return {
        "total_inventory": total_inventory,
        "low_stock_items": low_stock_items,
        "seasonal_distribution": {
            "Summer": 30,
            "Winter": 25,
            "All Season": 45
        },
        "brand_distribution": {
            "Michelin": 20,
            "Bridgestone": 15,
            "Continental": 10,
            "Others": 55
        }
    }