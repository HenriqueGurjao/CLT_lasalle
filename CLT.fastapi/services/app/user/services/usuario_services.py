from app.user.domain.usuario import Aluno, Professor
from app.user.repositories.usuario_repository import UsuarioRepository

class UsuarioService:
    def __init__(self, usuario_repository: UsuarioRepository):
        self.usuario_repository = usuario_repository

    def registrar_aluno(self, aluno: Aluno):
        return self.usuario_repository.criar_aluno(aluno)

    def registrar_professor(self, professor: Professor):
        return self.usuario_repository.criar_professor(professor)
    
    def get_user_by_matricula(self, matricula):
        return self.usuario_repository.obter_senha_usuario_por_matricula(matricula)
    
    def get_user_permissions(self, user):
        return self.usuario_repository.find_user_permissions(user.matricula)
