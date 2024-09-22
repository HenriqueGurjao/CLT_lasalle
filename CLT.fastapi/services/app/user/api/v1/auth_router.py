from fastapi import APIRouter, HTTPException
from app.user.repositories.usuario_repository import UsuarioRepository
from app.user.services.auth_service import AuthService
from app.user.domain.auth import LoginRequest 

router = APIRouter()

usuario_repository = UsuarioRepository()
auth_service = AuthService(usuario_repository)

@router.post("/auth/login")
def login(request: LoginRequest):  
    token = auth_service.login(request.matricula, request.senha)
    if token:
        return {"token": token}
    raise HTTPException(status_code=400, detail="Matricula ou senha incorretos")

@router.post("/auth/logout")
def logout():
    return auth_service.logout()
