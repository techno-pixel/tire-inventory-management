from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..schemas.inventory import InventoryItem, InventoryItemCreate
from ..crud.inventory import (
    get_inventory_items,
    get_inventory_item,
    create_inventory_item,
    update_inventory_item,
    delete_inventory_item
)
from ..utils.security import verify_token
from fastapi.security import OAuth2PasswordBearer
from ..crud.user import get_user_by_username

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.get("/", response_model=List[InventoryItem])
async def read_inventory_items(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    token_data = await verify_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    db_user = get_user_by_username(db, username=token_data.username)
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    items = get_inventory_items(db, skip=skip, limit=limit, user_id=db_user.id)
    return items

@router.post("/", response_model=InventoryItem)
async def create_item(
    item: InventoryItemCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    token_data = await verify_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    db_user = get_user_by_username(db, token_data.username)
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    return create_inventory_item(db=db, item=item, user_id=db_user.id)

@router.get("/{item_id}", response_model=InventoryItem)
async def read_item(
    item_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    token_data = await verify_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    db_user = get_user_by_username(db, token_data.username)
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    item = get_inventory_item(db, item_id=item_id, user_id=db_user.id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/{item_id}", response_model=InventoryItem)
async def update_item(
    item_id: int,
    item: InventoryItemCreate,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    token_data = await verify_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    db_user = get_user_by_username(db, token_data.username)
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    updated_item = update_inventory_item(db=db, item_id=item_id, item_data=item, user_id=db_user.id)
    if updated_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return updated_item

@router.delete("/{item_id}")
async def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    token_data = await verify_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    db_user = get_user_by_username(db, token_data.username)
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    success = delete_inventory_item(db=db, item_id=item_id, user_id=db_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"status": "success"}
