from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # Existing settings
    database_url: str = "postgresql://postgres:password@localhost:5432/tire_inventory"
    secret_key: str = "your-secret-key-here" # for prod
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    api_port: int = 8000
    api_host: str = "0.0.0.0"
    frontend_url: str = "http://localhost:4200"
    
    # Google Sheets settings
    google_sheets_credentials: str = ""  # Will be loaded from env
    google_sheets_spreadsheet_id: str = ""  # Will be loaded from env
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()