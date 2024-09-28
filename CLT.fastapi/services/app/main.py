from fastapi import FastAPI, Request
from app.user.api.v1.usuario_router import router as usuario_router
from app.user.api.v1.auth_router import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from app.middleware.auth_middleware import validate_token, check_user_permissions, is_user_active
from app.user.services.usuario_services import UsuarioService
from app.user.repositories.usuario_repository import UsuarioRepository
from app.user.domain.usuario import Professor

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
        return JSONResponse(status_code=401, content={"detail": "Usuario nao autenticado"})

    payload = validate_token(token_encrypted, request)

    if not is_user_active(payload, request) and request.url.path not in ["/api/v1/self/ativar_conta"]:
        return JSONResponse(status_code=403, content={"detail": "Conta nao esta ativa"})

    has_permission = check_user_permissions(payload, request)
    if not has_permission:
        return JSONResponse(status_code=403, content={"detail": "Usuário não tem permissâo para acessar este recurso"})
    
    response = await call_next(request)
    return response

@app.on_event("startup")
async def startup_event():
    usuario_repository = UsuarioRepository()
    usuario_service = UsuarioService(usuario_repository)  
    
    try:
        admin = usuario_service.get_user_by_matricula('admin')  # Busca pelo admin
    except:
        admin = None

    if admin is None:
        if not usuario_repository.usuario_existe("prof.admin@example.com"):
            admin = Professor(
                departamento="Administração",
                nome="Administrador",
                matricula="admin",
                email="prof.admin@example.com",
                senha="admin123",
                funcao="COORDENADOR", 
                ativo=True,   
                titulacao="ADMIN"
            )
            usuario_service.registrar_professor(admin)  
        else:
            print("O email 'prof.admin@example.com' já está cadastrado.")  


app.include_router(usuario_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
