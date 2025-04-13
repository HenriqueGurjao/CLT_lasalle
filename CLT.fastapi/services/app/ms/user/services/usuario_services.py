from typing import List, Optional, Union
from fastapi import HTTPException, Request, status
from app.ms.user.domain.usuario import Aluno, Professor, TokenPasswordResetRequest
from app.ms.user.repositories.usuario_repository import UsuarioRepository
from app.core.security import decrypt_token, verify_access_token, verify_password, create_access_token
from app.utils.email.body_email_templates import body_email_templates
from app.utils.email.email_sender import EmailSender
from app.core.security import encrypt_token
from app.core.security import validate_recovery_token

class UsuarioService:
    def __init__(self, usuario_repository: UsuarioRepository):
        self.usuario_repository = usuario_repository

    def registrar_aluno(self, aluno: Aluno):
        return self.usuario_repository.criar_aluno(aluno)

    def registrar_professor(self, professor: Professor):
        return self.usuario_repository.criar_professor(professor)
    
    def get_user_password_by_matricula(self, matricula):
        return self.usuario_repository.obter_senha_usuario_por_matricula(matricula)
    
    def get_student_by_matricula(self, matricula):
        return self.usuario_repository.obter_aluno_por_matricula(matricula)
    
    def get_teacher_by_matricula(self, matricula):
        return self.usuario_repository.obter_professor_por_matricula(matricula)
    
    def get_user_permissions(self, user):
        return self.usuario_repository.find_user_permissions(user.matricula)
    
    def update_user_password(self, matricula, password, new_password, request: Request):
        
        is_account_activate = "/ativar_conta" in str(request.url.path)
        print("ativacao? ",is_account_activate, matricula)
        senha  = None
        if not is_account_activate:
            senha = self.get_user_password_by_matricula(matricula) 
            password_check = verify_password(password, senha[0])
            if not password_check:
                raise Exception("Senha invalida")
            if new_password == password:
                raise Exception("Nova senha não pode ser igual a senha atual")
        else:
            password_check = True

        
        
        if len(new_password) < 8:
            raise Exception("Nova senha deve ter no mínimo 8 caracteres")
        
        if senha and password_check:
            print("chegou na chamada pra trocar senha")
            return self.usuario_repository.update_user_password(matricula, new_password)
        
    
    def activate_account(self, matricula:str, password:str , new_password: str, request: Request):
        self.update_user_password(matricula, password, new_password, request)
        return self.usuario_repository.activate_account(matricula)
    
    def is_account_active(self, matricula):
        return self.usuario_repository.is_user_active(matricula)
    
    def send_recovery_email(self, email:str, request: Request):
        usuario = self.usuario_repository.get_user_by_email(email)
        token = create_access_token({"sub": usuario[1], "type": "recovery", "user-agent": request.headers.get("User-Agent")})
        body = body_email_templates.recovery_password_email_body(
            nome=usuario[2],
            link=f"http://localhost:3000/redefinir_senha?token={encrypt_token(token)}"
        )

        email_sender = EmailSender()
        return email_sender.send_email(
            subject="Recuperação de Senha - Central La Salle de TCC`s",
            html_body=body,
            destinatarios=[email]
        )
    
    def forgot_password(self, data: TokenPasswordResetRequest, request: Request):
        try:
            payload = validate_recovery_token(self, data.token, request)
            email = payload['sub']

            if len(data.new_password) < 8:
                raise HTTPException(status_code=400, detail="A nova senha deve ter no mínimo 8 caracteres")
            
            usuario = self.usuario_repository.get_user_by_email(email)
            matricula = usuario[3]

            if len(data.new_password) < 8:
                raise Exception("Nova senha deve ter no mínimo 8 caracteres")
            
            if data.new_password!= data.new_password_confirm:
                raise Exception("Nova senha e confirmação de senha não conferem")
            
            senha = self.get_user_password_by_matricula(matricula)
            if verify_password(data.new_password, senha[0]):
                raise Exception("Nova senha não pode ser igual a senha anterior")
            
            self.usuario_repository.update_user_password(matricula, data.new_password)

            return {"msg": "Senha redefinida com sucesso"}
        except Exception as e:
            raise HTTPException(status_code=400, detail="generico: "+ str(e))

    def get_user_by(
            self,
            table: str,
            value: Union[str, int],
            by: str = "id",
            columns: Optional[List[str]] = None
        ):
        return self.usuario_repository.get_user_by(
            table=table,
            value=value,
            by=by,
            columns=columns
        )
    
    def get_teacher_by_id(self, teacher_id):
        return self.usuario_repository.get_teacher_by_id(teacher_id)
    
    def get_student_by_id(self, student_id):
        return self.usuario_repository.get_student_by_id(student_id)