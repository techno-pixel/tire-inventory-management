from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Database settings
    database_url: str = "postgresql://postgres:password@localhost:5432/tire_inventory"
    
    # JWT Settings
    secret_key: str = "your-secret-key-here"  # In production, use a secure secret key
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # API Settings
    api_port: int = 8000
    api_host: str = "0.0.0.0"
    
    # CORS Settings
    frontend_url: str = "http://localhost:4200"  # Angular default port
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

# You can access settings like this:
# settings = get_settings()
# print(settings.frontend_url)  # http://localhost:4200