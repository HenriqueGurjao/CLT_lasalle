from fastapi import Request
from jose import jwt
from starlette.responses import JSONResponse
from app.core.security import verify_access_token, decrypt_token
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
    
def check_user_permissions(payload, request: Request):

    endpoint = request.url.path 
    method = request.method 
    matricula = payload.get("sub")
    if matricula is None:
        return JSONResponse(status_code=403, content={"detail": "Matrícula não fornecida no token"})

    role = payload.get("role")

    #Trocar para if not starts e ver se o metodo for diferente de get, ai retorna false.
    if not role.startswith("COORDENADOR") and endpoint.startswith("/api/v1/coordenador/") and method != "GET":
        return False
    elif not role.startswith("PROFESSOR") and endpoint.startswith("/api/v1/professor/admin") and method != "GET":
        return False
    
    return True
    