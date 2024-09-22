from fastapi import FastAPI, Request
from app.user.api.v1.usuario_router import router as usuario_router
from app.user.api.v1.auth_router import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from app.middleware.auth_middleware import validate_token, check_user_permissions

app = FastAPI(
    title="API de Usuários",
    description="API de gerenciamento de usuários",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://localhost:8000",
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

    if request.url.path  in ["/docs", "/redoc", "/api/v1/auth/login", "/openapi.json", "/api/v1/auth/logout"]:
        return await call_next(request)

    token_encrypted = request.cookies.get("auth_token")
    
    if token_encrypted is None:
        return JSONResponse(status_code=401, content={"detail": "Token não encontrado"})

    payload = validate_token(token_encrypted, request)
    has_permission = check_user_permissions(payload, request)

    if not has_permission:
        return JSONResponse(status_code=403, content={"detail": "Usuário não tem permissâo para acessar este recurso"})
    
    response = await call_next(request)
    return response

app.include_router(usuario_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
