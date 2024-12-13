import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, inventory
from .database import Base, engine
from .config import get_settings
from .routers import auth, inventory, sync, analytics, dummy_data

settings = get_settings()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Tire Inventory API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(inventory.router, prefix="/api/inventory", tags=["inventory"])
app.include_router(sync.router, prefix="/api/sync", tags=["sync"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(dummy_data.router, prefix="/api/dummy", tags=["dummy_data"])

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.api_host, port=settings.api_port, reload=True)