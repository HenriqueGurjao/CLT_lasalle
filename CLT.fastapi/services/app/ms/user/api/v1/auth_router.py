from fastapi import APIRouter, HTTPException, Response, Request
from fastapi.responses import JSONResponse
import jwt
from app.ms.user.repositories.usuario_repository import UsuarioRepository
from app.middleware.auth_middleware import refresh_token
from app.ms.user.services.auth_service import AuthService
from app.ms.user.domain.auth import LoginRequest 
from app.core.security import decrypt_token, encrypt_token, verify_access_token
from datetime import timedelta

router = APIRouter()

usuario_repository = UsuarioRepository()
auth_service = AuthService(usuario_repository)

@router.post("/auth/login", tags=["Autentificacao"])
def login(request: LoginRequest, response: Response, req: Request): 
    user = auth_service.login(request.matricula, request.senha, req) 
    

    if user:
        response.set_cookie(
            key="auth_token",
            value=encrypt_token(user[0]),
            httponly=True, 
            samesite='Lax',  
            secure=False, 
            max_age=7 * 24 * 60 * 60, 
            expires=7 * 24 * 60 * 60  
        )

        response.set_cookie(
            key="refresh_token",
            value=encrypt_token(user[2]),
            httponly=True, 
            samesite='Lax',  
            secure=False, 
            max_age=7 * 24 * 60 * 60, 
            expires=timedelta(days=7).total_seconds()
        )

        is_acitve = usuario_repository.is_user_active(request.matricula)

        return {"message": "Login successful", "token": user[0], "role": user[1], "refresh_token": user[2], "is_active": is_acitve}
    
    raise HTTPException(status_code=400, detail="Matricula ou senha incorretos")

@router.post("/auth/logout", tags=["Autentificacao"])
def logout(response: Response):
    response.delete_cookie("auth_token")  
    response.delete_cookie("refresh_token")
    return {"message": "Logout successful"}

@router.post("/auth/refresh", tags=["Autentificacao"])
async def refresh(request: Request):
    referer = request.headers.get("referer") or ""
    print(referer)
    if "recuperar_senha" in referer:
        return {"detail": "ok"}
    return refresh_token(request)

@router.get("/auth/verify-role", tags=["Autentificacao"])
async def verify(request: Request):

    auth_token = request.cookies.get("auth_token")

    try:
        refresh_token = decrypt_token(auth_token)
        
        payload = verify_access_token(refresh_token)  

        if payload is None:
            return JSONResponse(status_code=401, content={"detail": "Refresh token inválido"})

        role = payload.get("role")
        return {"role": role}
    except (jwt.JWTError, IndexError) as e:
        return JSONResponse(status_code=401, content={"detail": "Token inválido"})