from app.domain.usuario import Aluno, Professor
from app.repositories.usuario_repository import UsuarioRepository

class UsuarioService:
    def __init__(self, usuario_repository: UsuarioRepository):
        self.usuario_repository = usuario_repository

    def registrar_aluno(self, aluno: Aluno):
        return self.usuario_repository.criar_aluno(aluno)

    def registrar_professor(self, professor: Professor):
        return self.usuario_repository.criar_professor(professor)
