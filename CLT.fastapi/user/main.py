from fastapi import FastAPI
from app.api.v1.usuario_router import router as usuario_router

app = FastAPI()

app.include_router(usuario_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
