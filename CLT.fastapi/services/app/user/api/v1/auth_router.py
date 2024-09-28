from fastapi import APIRouter, HTTPException, Response, Request
from app.user.repositories.usuario_repository import UsuarioRepository
from app.middleware.auth_middleware import refresh_token
from app.user.services.auth_service import AuthService
from app.user.domain.auth import LoginRequest 
from app.core.security import encrypt_token
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
            expires=3600  
        )

        response.set_cookie(
            key="refresh_token",
            value=encrypt_token(user[2]),
            httponly=True, 
            samesite='Lax',  
            secure=False,  
            expires=timedelta(days=7).total_seconds()
        )
        return {"message": "Login successful", "token": user[0], "role": user[1], "refresh_token": user[2]}
    
    raise HTTPException(status_code=400, detail="Matricula ou senha incorretos")

@router.post("/auth/logout", tags=["Autentificacao"])
def logout(response: Response):
    response.delete_cookie("auth_token")  
    response.delete_cookie("refresh_token")
    return {"message": "Logout successful"}

@router.post("/api/v1/auth/refresh", tags=["Autentificacao"])
async def refresh(request: Request):
    return refresh_token(request)