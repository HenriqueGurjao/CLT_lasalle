import sys
import traceback
from fastapi import FastAPI, Request, Response
from app.ms.user.api.v1.usuario_router import router as usuario_router
from app.ms.user.api.v1.auth_router import router as auth_router
from app.ms.course.api.v1.course_router import router as course_router
from app.ms.final_paper.api.v1.projeto_final_router import router as projeto_final_router
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from app.middleware.auth_middleware import validate_token, check_user_permissions, is_user_active, is_self_management
from app.ms.user.services.usuario_services import UsuarioService
from app.ms.user.repositories.usuario_repository import UsuarioRepository
from app.ms.user.domain.usuario import Professor

app = FastAPI(
    title="API CLT de Usuários",
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
    allow_origins=["*"],	  
    allow_credentials=True, 
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    try:
        if request.url.path  in [
            "/docs", 
            "/redoc", 
            "/api/v1/auth/login", 
            "/openapi.json", 
            "/api/v1/auth/logout", 
            "/api/v1/auth/refresh", 
            "/api/v1/enviar_email_recuperacao",
            "/api/v1/redefinir_senha"
        ] or request.method == "OPTIONS":
            try:
                return await call_next(request)
            except Exception as e:
                return JSONResponse(status_code=406, content={"detail": f"Erro ao verificar token: {e}"})

        token_encrypted = request.cookies.get("auth_token")
        
        if token_encrypted is None:
            return JSONResponse(status_code=401, content={"detail": "Usuario nao autenticado"})

        payload = validate_token(token_encrypted, request)

        if payload is None:
            return JSONResponse(status_code=401, content={"detail": "Token inválido"})

        if isinstance(payload, dict):
            # if not is_user_active(payload, request) and request.url.path not in ["/api/v1/self/ativar_conta"]:
            #     return JSONResponse(status_code=303, content={"detail": "Conta nao esta ativa"})

            has_permission = check_user_permissions(payload, request)
            if not has_permission:
                return JSONResponse(status_code=403, content={"detail": "Usuário não tem permissâo para acessar este recurso"})
            
            # self_management = is_self_management(payload, request)
            # if not self_management:
            #     return JSONResponse(status_code=403, content={"detail": "Usuario nao pode manipular dados de outros usuarios"})

            response = await call_next(request)
            if response is None:
                return JSONResponse({"error": "No response"}, status_code=500)
            return response
        return JSONResponse(status_code=401, content={"detail": "Token inválido"})
    except Exception as e:
        exc_type, exc_value, exc_tb = sys.exc_info()
        tb = traceback.extract_tb(exc_tb)
        last_trace = tb[-1]  # Pega a última linha do traceback

        print(f"Erro: {e}")
        print(f"Arquivo: {last_trace.filename}")
        print(f"Linha: {last_trace.lineno}")
        print(f"Função: {last_trace.name}")
        return JSONResponse(status_code=503, content={"detail": f"Erro ao processar a requisicao: {e}"})
        raise JSONResponse(status_code=401, content={"detail": f"Erro ao processar token: {e}"})
            

@app.on_event("startup")
async def startup_event():
    usuario_repository = UsuarioRepository()
    usuario_service = UsuarioService(usuario_repository)  
    
    try:
        admin = usuario_service.get_user_by_matricula('00500500')  # Busca pelo admin
    except:
        admin = None

    print(admin)
    if admin is None:
        if not usuario_repository.usuario_existe("prof.admin@example.com"):
            admin = Professor(
                departamento="Administração",
                nome="Administrador",
                matricula="00500500",
                email="prof.admin@example.com",
                senha="admin123",
                funcao="COORDENADOR", 
                ativo=True,   
                titulacao="ADMIN" 
            )
            usuario_service.registrar_professor(admin)  
          


app.include_router(usuario_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(course_router, prefix="/api/v1")
app.include_router(projeto_final_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
