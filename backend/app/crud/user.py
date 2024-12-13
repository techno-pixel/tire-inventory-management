from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user import UserCreate
from ..utils.security import get_password_hash
from typing import Optional

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(User.username == username).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        is_active=True  # ensure is_active is set
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


# from sqlalchemy.orm import Session
# from ..models.user import User
# from ..schemas.user import UserCreate
# from ..utils.security import get_password_hash
# from typing import Optional

# def get_user_by_email(db: Session, email: str) -> Optional[User]:
#     return db.query(User).filter(User.email == email).first()

# def get_user_by_username(db: Session, username: str) -> Optional[User]:
#     return db.query(User).filter(User.username == username).first()

# def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
#     return db.query(User).filter(User.id == user_id).first()

# def create_user(db: Session, user: UserCreate) -> User:
#     hashed_password = get_password_hash(user.password)
#     db_user = User(
#         email=user.email,
#         username=user.username,
#         hashed_password=hashed_password
#     )
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# def get_users(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(User).offset(skip).limit(limit).all()