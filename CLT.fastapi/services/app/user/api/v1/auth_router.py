from fastapi import APIRouter, HTTPException, Response
from app.user.repositories.usuario_repository import UsuarioRepository
from app.user.services.auth_service import AuthService
from app.user.domain.auth import LoginRequest 
from app.core.security import encrypt_token

router = APIRouter()

usuario_repository = UsuarioRepository()
auth_service = AuthService(usuario_repository)

@router.post("/auth/login")
def login(request: LoginRequest, response: Response):  
    token = auth_service.login(request.matricula, request.senha)

    # if token:
        #     return {"token": token}
        # raise HTTPException(status_code=400, detail="Matricula ou senha incorretos")
    if token:
        response.set_cookie(
            key="auth_token",
            value=encrypt_token(token),
            httponly=True, 
            samesite='Lax',  
            secure=False,  
            expires=3600  
        )
        token = auth_service.login(request.matricula, request.senha)
        return {"message": "Login successful"}
    
    raise HTTPException(status_code=400, detail="Matricula ou senha incorretos")

@router.post("/auth/logout")
def logout(response: Response):
    response.delete_cookie("auth_token")  # Remove o cookie ao fazer logout
    return {"message": "Logout successful"}
