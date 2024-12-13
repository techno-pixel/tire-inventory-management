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
    """Calculate and return dashboard metrics"""
    
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
    
    # Calculate inventory value
    total_value = db.query(
        func.sum(InventoryItem.quantity * InventoryItem.price)
    ).scalar() or 0
    
    # Get seasonal distribution
    seasonal_query = db.query(
        InventoryItem.type,
        func.sum(InventoryItem.quantity).label('total')
    ).group_by(InventoryItem.type).all()
    
    seasonal_distribution = {
        item[0]: item[1] for item in seasonal_query
    }
    
    # Get brand distribution
    brand_query = db.query(
        InventoryItem.brand,
        func.sum(InventoryItem.quantity).label('total')
    ).group_by(InventoryItem.brand).all()
    
    brand_distribution = {
        item[0]: item[1] for item in brand_query
    }
    
    # Get trending sizes
    size_query = db.query(
        InventoryItem.size,
        func.sum(InventoryItem.quantity).label('total')
    ).group_by(InventoryItem.size).order_by(
        func.sum(InventoryItem.quantity).desc()
    ).limit(5).all()
    
    trending_sizes = {
        item[0]: item[1] for item in size_query
    }
    
    return {
        "total_inventory": total_inventory,
        "low_stock_items": low_stock_items,
        "total_value": round(total_value, 2),
        "seasonal_distribution": seasonal_distribution,
        "brand_distribution": brand_distribution,
        "trending_sizes": trending_sizes
    }

@router.get("/inventory-alerts")
async def get_inventory_alerts(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    """Get inventory alerts for low stock and other issues"""
    
    # Verify token
    token_data = await verify_token(token)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Get low stock items
    low_stock = db.query(InventoryItem).filter(
        InventoryItem.quantity <= InventoryItem.minimum_stock
    ).all()
    
    # Get items with no recent updates
    month_ago = datetime.now() - timedelta(days=30)
    no_updates = db.query(InventoryItem).filter(
        InventoryItem.last_updated <= month_ago
    ).all()
    
    return {
        "low_stock": [
            {
                "id": item.id,
                "sku": item.sku,
                "name": f"{item.brand} {item.model}",
                "quantity": item.quantity,
                "minimum_stock": item.minimum_stock
            }
            for item in low_stock
        ],
        "no_recent_updates": [
            {
                "id": item.id,
                "sku": item.sku,
                "name": f"{item.brand} {item.model}",
                "last_updated": item.last_updated
            }
            for item in no_updates
        ]
    }