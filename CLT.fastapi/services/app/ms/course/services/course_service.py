from app.ms.course.repositories.course_repository import CursoRepository

class CursoService:
    def __init__(self):
        self.repository = CursoRepository()

    def criar_curso(self, nome: str, descricao: str, periodo: str):
        return self.repository.criar_curso(nome, descricao, periodo)

    def matricular_aluno_em_curso(self, matricula: str, curso_id: int, periodo: int):
        return self.repository.matricular_aluno_em_curso(matricula, curso_id, periodo)

    def alocar_professor_em_curso(self, professor_id: int, curso_id: int, periodo_inicio: str, periodo_fim: str, funcao: str):
        return self.repository.alocar_professor_em_curso(professor_id, curso_id, periodo_inicio, periodo_fim, funcao)
    
    def listar_cursos_detalhadamente(self):
        return self.repository.obter_todos_cursos()
    
    def listar_cursos_resumidos(self):
        return self.repository.obter_cursos_resumidos()
