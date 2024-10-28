from app.ms.user.domain.usuario import Aluno, Professor
from app.ms.user.repositories.usuario_repository import UsuarioRepository
from app.core.security import verify_password

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
    
    def update_user_password(self, matricula, password, new_password):
        senha = self.get_user_password_by_matricula(matricula) 
        password_check = verify_password(password, senha[0])

        if not password_check:
            raise Exception("Senha invalida")
        
        if new_password == password:
            raise Exception("Nova senha não pode ser igual a senha atual")
        
        if len(new_password) < 8:
            raise Exception("Nova senha deve ter no mínimo 8 caracteres")
        
        if senha and password_check:
            return self.usuario_repository.update_user_password(matricula, new_password)
        
    
    def activate_account(self, matricula, password, new_password):
        self.update_user_password(matricula, password, new_password)
        return self.usuario_repository.activate_account(matricula)
    
    def is_account_active(self, matricula):
        return self.usuario_repository.is_user_active(matricula)
