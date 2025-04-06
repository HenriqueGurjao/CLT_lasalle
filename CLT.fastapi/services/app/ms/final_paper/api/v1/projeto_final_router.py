from typing import List, Optional
from app.ms.final_paper.services.projeto_final_service import ProjetoFinalService
from app.ms.final_paper.repositories.projeto_final_repository import ProjetoFinalRepository 
from app.ms.final_paper.repositories.tag_repository import TagRepository 
from app.ms.final_paper.services.tag_service import TagService
from app.ms.final_paper.domain.projeto_final import ProjetoFiltroSchema, ProjetoFinalCreateSchema
from fastapi import APIRouter, Body, File, Form, HTTPException, Query, Depends, UploadFile
from ....user.services.usuario_services import UsuarioRepository, UsuarioService
from ....course.services.course_service import CursoService, CursoRepository
from fastapi.openapi.models import Schema
from fastapi.responses import FileResponse
import json
import os

router = APIRouter()

def get_usuario_service() -> UsuarioService:
    usuario_repository = UsuarioRepository()
    return UsuarioService(usuario_repository)

def get_curso_service() -> CursoService:
    return CursoService()

# projeto_service = ProjetoFinalService(ProjetoFinalRepository(), TagService(TagRepository()))

def get_projeto_service(
    usuario_service: UsuarioService = Depends(get_usuario_service),
    curso_service: CursoService = Depends(get_curso_service),
) -> ProjetoFinalService:
    projeto_repository = ProjetoFinalRepository()
    tag_repository = TagRepository()
    tag_service = TagService(tag_repository)
    return ProjetoFinalService(projeto_repository, tag_service, curso_service, usuario_service)

def projeto_schema_dep():
    """
    Só serve para exibir o schema no Swagger
    """
    return ProjetoFinalCreateSchema.model_json_schema()


@router.post("/professor/projeto-final", tags=["Projeto_final"])
async def criar_projeto_final(
    # projeto_data_example: ProjetoFinalCreateSchema = Body(
    #     default=..., 
    #     description="Schema de exemplo para documentação apenas"
    # ),
    projeto_data: str = Form(...),  
    pdf_file: UploadFile = File(...),
    projeto_service: ProjetoFinalService = Depends(get_projeto_service),
    usuario_service: UsuarioService = Depends(get_usuario_service)
):

    try:
        projeto_data = json.loads(projeto_data)
        projeto_data = ProjetoFinalCreateSchema(**projeto_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar projeto_data: {str(e)}")
    try:
        aluno_id = usuario_service.get_student_by_matricula(projeto_data.aluno_matr)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
    try:
        orientador_id = usuario_service.get_teacher_by_matricula(projeto_data.orientador_matr)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

    try:
        projeto_id = projeto_service.criar_projeto_com_tags(
            curso_id=projeto_data.curso_id,
            orientador_id=orientador_id['id'],
            aluno_id=aluno_id['aluno_id'],
            titulo=projeto_data.titulo,
            status=projeto_data.status,
            tags=projeto_data.tags,
            pdf_file=pdf_file
        )
        return {"projeto_id": projeto_id}
    except Exception as e:
        print(f"Erro ao criar projeto com tags: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/projetos", tags=["Projeto_final"])
async def listar_projetos_finais(
    cursos_id: Optional[str] = Query(None),
    status: Optional[List[str]] = Query(None),
    aluno_id: Optional[List[int]] = Query(None),
    orientador_id: Optional[List[int]] = Query(None),
    pagina:  Optional[List[int]] = Query(1),
    itens_por_pagina: Optional[List[int]] = Query(2),
    pesquisa: Optional[str] = Query(None),
    periodos: Optional[str] = Query(None),
    projeto_service: ProjetoFinalService = Depends(get_projeto_service)
):
    try:
        projetos = projeto_service.listar_projetos_com_filtros(
            cursos_id=cursos_id,
            status=status,
            aluno_id=aluno_id,
            orientador_id=orientador_id,
            pagina=pagina,
            itens_por_pagina=itens_por_pagina,
            pesquisa=pesquisa,
            periodos=periodos
        )
        return projetos
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/download-pdf/{id}", tags=["Projeto_final"])
async def download_pdf(id: int, projeto_service: ProjetoFinalService = Depends(get_projeto_service)):
    try:
        
        pdf = projeto_service.get_pdf_path_by_id(id)
        pdf_path = pdf['pdf_path']

        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=404, detail="Arquivo não encontrado.")
        
        return FileResponse(pdf_path, media_type='application/pdf', filename=os.path.basename(pdf_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao tentar baixar o PDF: {str(e)}")
