from fastapi import APIRouter, Depends, HTTPException
from app.ms.course.services.course_service import CursoService
from app.ms.course.domain.course import CursoCreateSchema, MatriculaSchema, ProfessorCursoSchema

router = APIRouter()
curso_service = CursoService()

@router.post("/coordenador/curso", tags=["curso"])
def criar_curso(curso: CursoCreateSchema):
    try:
        curso_id = curso_service.criar_curso(curso.nome, curso.descricao, curso.periodo)
        return {"curso_id": curso_id, "message": "Curso criado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/coordenador/curso/matricular/{matricula}", tags=["curso"])
def matricular_aluno_em_curso(matricula: str, curso: MatriculaSchema):
    try:
        curso_service.matricular_aluno_em_curso(matricula, curso.curso_id, curso.periodo)
        return {"message": "Aluno matriculado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/coordenador/curso/alocar-professor", tags=["curso"])
def alocar_professor_em_curso(professor: ProfessorCursoSchema):
    try:
        curso_service.alocar_professor_em_curso(professor.professor_id, professor.curso_id, professor.periodo_inicio, professor.periodo_fim, professor.funcao)
        return {"message": "Professor alocado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/cursos", tags=["curso"])
async def obter_cursos():
    return curso_service.listar_cursos_detalhadamente()

@router.get("/cursos/resumido", tags=["curso"])
async def obter_cursos_resumidos():
    return curso_service.listar_cursos_resumidos()

