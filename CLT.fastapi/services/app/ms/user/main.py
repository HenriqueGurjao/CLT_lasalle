from fastapi import FastAPI, Request
from app.ms.user.api.v1.usuario_router import router as usuario_router
from app.ms.user.api.v1.auth_router import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse

app = FastAPI(
    title="API de Usuários",
    description="API de gerenciamento de usuários",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://meudominio.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True, 
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    print(f"Middleware chamado para {request.url.path}")
    token = request.headers.get("Authorization")
    
    if token == "Bearer valid-token":
        response = await call_next(request)
    else:
        return JSONResponse(status_code=401, content={"detail": "Token não encontrado ou inválido"})
    
    return response

app.include_router(usuario_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
