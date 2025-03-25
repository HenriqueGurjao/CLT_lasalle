from typing import List, Optional
from app.ms.final_paper.services.projeto_final_service import ProjetoFinalService
from app.ms.final_paper.repositories.projeto_final_repository import ProjetoFinalRepository 
from app.ms.final_paper.repositories.tag_repository import TagRepository 
from app.ms.final_paper.services.tag_service import TagService
from app.ms.final_paper.domain.projeto_final import ProjetoFiltroSchema, ProjetoFinalCreateSchema
from fastapi import APIRouter, HTTPException, Query, Depends
from ....user.services.usuario_services import UsuarioRepository, UsuarioService

router = APIRouter()

def get_usuario_service() -> UsuarioService:
    usuario_repository = UsuarioRepository()
    return UsuarioService(usuario_repository)

projeto_service = ProjetoFinalService(ProjetoFinalRepository(), TagService(TagRepository()))

@router.post("/professor/projeto-final", tags=["Projeto_final"])
async def criar_projeto_final(projeto_data: ProjetoFinalCreateSchema, usuario_service: UsuarioService = Depends(get_usuario_service)):
    try:
        aluno_id = usuario_service.get_student_by_matricula(projeto_data.aluno_matr)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    try:
        orientador_id = usuario_service.get_teacher_by_matricula(projeto_data.orientador_matr)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    
    print(orientador_id["id"])
    print(aluno_id["aluno_id"])

    # print(projeto_data.id, projeto_data.curso_id, projeto_data.titulo, projeto_data.status, projeto_data.tags, aluno_id["id"], orientador_id["id"])
    
    try:
        projeto_id = projeto_service.criar_projeto_com_tags(
            curso_id=projeto_data.curso_id,
            orientador_id=orientador_id['id'],
            aluno_id=aluno_id['aluno_id'],
            titulo=projeto_data.titulo,
            status=projeto_data.status,
            tags=projeto_data.tags
        )
        return {"projeto_id": projeto_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/projetos", tags=["Projeto_final"])
async def listar_projetos_finais(
    curso_id: Optional[List[int]] = Query(None),
    status: Optional[List[str]] = Query(None),
    aluno_id: Optional[List[int]] = Query(None),
    orientador_id: Optional[List[int]] = Query(None)
):
    try:
        projetos = projeto_service.listar_projetos_com_filtros(
            curso_id=curso_id,
            status=status,
            aluno_id=aluno_id,
            orientador_id=orientador_id
        )
        return projetos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))