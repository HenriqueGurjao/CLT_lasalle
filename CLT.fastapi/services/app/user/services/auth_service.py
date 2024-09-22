from app.user.repositories.usuario_repository import UsuarioRepository
from app.core.security import create_access_token, verify_password, create_refresh_token
from fastapi import  HTTPException, Request

class AuthService:
    def __init__(self, usuario_repository: UsuarioRepository):
        self.usuario_repository = usuario_repository

    def login(self, matricula: str, password: str, request: Request):
        try:
            usuario = self.usuario_repository.obter_senha_usuario_por_matricula(matricula)
            permission = self.usuario_repository.find_user_permissions(matricula)   
        except HTTPException as e:
            raise e 

        if usuario and verify_password(password, usuario[0]):
            token = create_access_token({"sub": usuario[1], "role": permission, "user-agent": request.headers.get("User-Agent")})
            refresh_token = create_refresh_token({"sub": usuario[1]})
            return [token, permission, refresh_token]
        raise HTTPException(status_code=400, detail="Senha incorreta")  


    def logout(self):
        return {"message": "Logout realizado com sucesso"}
