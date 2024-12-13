from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from faker import Faker
import random
from ..database import get_db
from ..crud.inventory import create_inventory_item
from ..utils.security import verify_token
from fastapi.security import OAuth2PasswordBearer
from ..crud.user import get_user_by_username
from ..schemas.inventory import InventoryItemCreate

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
fake = Faker()

@router.post("/generate-dummy-data")
async def generate_dummy_data(
    count: int = 20,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    token_data = await verify_token(token)
    if not token_data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    db_user = get_user_by_username(db, token_data.username)
    if not db_user:
        raise HTTPException(status_code=401, detail="User not found")

    brands = ["Michelin", "Bridgestone", "Continental", "Pirelli", "Goodyear"]
    types = ["All Season", "Summer", "Winter", "Performance"]
    sizes = ["225/45R17", "215/55R16", "245/40R19", "275/35R20", "205/60R15"]
    
    for _ in range(count):
        brand = random.choice(brands)
        tire_type = random.choice(types)
        size = random.choice(sizes)
        model = fake.word().capitalize() + " " + fake.word().upper()
        sku = f"{brand[:4].upper()}-{model.replace(' ','')}-{size.replace('/','').replace('R','')}"
        quantity = random.randint(1, 50)
        price = round(random.uniform(100, 300), 2)
        location = f"{random.choice(['A','B','C','D'])}{random.randint(1,20)}"
        minimum_stock = random.randint(2,10)

        item_data = InventoryItemCreate(
            name=model,
            sku=sku,
            quantity=quantity,
            price=price,
            brand=brand,
            size=size,
            type=tire_type,
            location=location,
            minimum_stock=minimum_stock
        )
        create_inventory_item(db, item_data, user_id=db_user.id)

    return {"status": "success", "message": f"{count} items generated"}
