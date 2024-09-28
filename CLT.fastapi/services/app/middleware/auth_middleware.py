from fastapi import Request
from jose import jwt
from starlette.responses import JSONResponse
from app.core.security import verify_access_token, decrypt_token, create_access_token, create_refresh_token, encrypt_token
from app.user.services.usuario_services import UsuarioService
from app.user.repositories.usuario_repository import UsuarioRepository
from datetime import datetime, timezone
from jose import jwt

def validate_token(token_encrypted: str, request: Request):
    try:
        token = decrypt_token(token_encrypted)

        payload = verify_access_token(token)

        if payload is None:
            return JSONResponse(status_code=401, content={"detail": "Token inválido"})

        exp = payload.get("exp")
        user_agent = payload.get("user-agent")

        if not user_agent == request.headers.get("User-Agent"):
            return JSONResponse(status_code=403, content={"detail": "Token inválido"})

        if exp is None:
            return JSONResponse(status_code=403, content={"detail": "Token sem expiração"})

        exp_datetime = datetime.fromtimestamp(exp, tz=timezone.utc)

        if datetime.now(timezone.utc) > exp_datetime:
            return JSONResponse(status_code=403, content={"detail": "Token expirado"})

        return payload
    except (jwt.JWTError, IndexError) as e:
        return JSONResponse(status_code=401, content={"detail": "Token inválido"})
    
def refresh_token(request: Request):
    refresh_token_encrypted = request.cookies.get("refresh_token")
    
    if refresh_token_encrypted is None:
        return JSONResponse(status_code=401, content={"detail": "Token não encontrado"})
    
    try:
        refresh_token = decrypt_token(refresh_token_encrypted)
        
        payload = verify_access_token(refresh_token)  

        if payload is None:
            return JSONResponse(status_code=401, content={"detail": "Refresh token inválido"})

        exp = payload.get("exp")
        if exp is None or datetime.now(timezone.utc) > datetime.fromtimestamp(exp, tz=timezone.utc):
            return JSONResponse(status_code=403, content={"detail": "Refresh token expirado"})

        new_access_token = create_access_token(data={
            "sub": payload["sub"], 
            "role": payload["role"],
            "user-agent": payload.get("user-agent")
        })
        new_refresh_token = create_refresh_token(data={
            "sub": payload["sub"], 
            "role": payload["role"],
            "user-agent": payload.get("user-agent")
        })

        response = JSONResponse(content={
            "access_token": new_access_token, 
            "refresh_token": new_refresh_token
        })
        response.set_cookie(key="auth_token", value=encrypt_token(new_access_token), httponly=True)
        response.set_cookie(key="refresh_token", value=encrypt_token(new_refresh_token), httponly=True)
        
        return response

    except Exception as e:
        return JSONResponse(status_code=401, content={"detail": f"Erro ao processar refresh token: {e}"})

def check_user_permissions(payload, request: Request):

    endpoint = request.url.path 
    method = request.method 
    matricula = payload.get("sub")
    if matricula is None:
        return JSONResponse(status_code=403, content={"detail": "Matrícula não fornecida no token"})

    role = payload.get("role")

    # print("entrei")
    # if endpoint.__contains__("/self"):
    #     print("entrei 1")
    #     usuario_repository = UsuarioRepository()
    #     bd_matricula = usuario_repository.obter_aluno_por_matricula(request.path_params["matricula"] or request.query_params["matricula"])
    #     print(matricula, bd_matricula["matricula"])
    #     if not matricula == bd_matricula['matricula']:
    #         print("entrei 2")
    #         return JSONResponse(status_code=403, content={"detail": "Usuario nao pode manipular dados de outros usuarios"})

    if not role.startswith("COORDENADOR") and endpoint.startswith("/api/v1/coordenador/") and method != "GET":
        return False
    elif not role.startswith("PROFESSOR") and endpoint.startswith("/api/v1/professor/admin") and method != "GET":
        return False
    
    return True
    
def is_user_active(payload, request: Request):
    #verificar no banco se o usuario possui conta ativada para uso
    usuario_repository = UsuarioRepository()
    usuario_service = UsuarioService(usuario_repository)

    matricula = payload.get("sub")
    if matricula is None:
        return JSONResponse(status_code=403, content={"detail": "Matrícula não fornecida no token"})
    
    is_active = usuario_service.is_account_active(matricula)

    if not is_active:
        return False
        return JSONResponse(status_code=403, content={"detail": "Conta do usuário está desativada"})
    
    return True # retorna True se o usuario possui conta ativada, False caso contrario