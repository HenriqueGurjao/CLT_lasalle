from typing import Optional
from app.ms.final_paper.repositories.projeto_final_repository import ProjetoFinalRepository
from app.ms.final_paper.services.tag_service import TagService
from app.ms.course.services.course_service import CursoService
from app.ms.user.services.usuario_services import UsuarioService
from fastapi import FastAPI, File, HTTPException, UploadFile
import httpx
from typing import List
import os
import sys 
import traceback
import shutil
from datetime import datetime
from ....utils.pdf.pdf import salvar_capa_pdf

class ProjetoFinalService:
    def __init__(
        self, 
        projeto_repository: ProjetoFinalRepository, 
        tag_service: TagService,
        curso_service: CursoService,
        usuario_service: UsuarioService
    ):
        self.projeto_repository = projeto_repository
        self.tag_service = tag_service
        self.curso_service = curso_service
        self.usuario_service = usuario_service

    def criar_projeto_com_tags(self, curso_id: int, orientador_id: int, aluno_id: int, titulo: str, status: str, pdf_path: str = None,pdf_file: UploadFile = File(...), tags: list = None):
        
        curso = self.curso_service.buscar_curso_por_id(curso_id)
        orientador = self.usuario_service.get_user_by(
            by="p.id",
            value=orientador_id,
            columns=['u.matricula'],
            table="professores p",
        )
        aluno = self.usuario_service.get_user_by(
            by="a.id",
            value=aluno_id,
            columns=['u.matricula'],
            table="alunos a",
        )

        now = datetime.now()
        semestre = 1 if now.month <= 6 else 2
        periodo = f"{now.year}.{semestre}"

        pdf_path = os.path.normpath(os.path.join(
            "C:/projetos", 
            str(curso['nome']),
            periodo,
            str(orientador[0]),
            str(aluno[0]),
            f"{titulo}_{aluno[0]}.pdf"
        ))
        os.makedirs(os.path.dirname(pdf_path), exist_ok=True)

        with open(pdf_path, "wb") as buffer:
            shutil.copyfileobj(pdf_file.file, buffer)
            
        try:
            projeto_id = self.projeto_repository.criar_projeto_final(
                curso_id, orientador_id, aluno_id, titulo, status, pdf_path
            )

            path_capa = salvar_capa_pdf(pdf_path)
        except Exception as e:
            if os.path.exists(pdf_path):
                os.remove(pdf_path)
            exc_type, exc_value, exc_tb = sys.exc_info()
            tb = traceback.extract_tb(exc_tb)
            last_trace = tb[-1]  

            print(f"Erro: {e}")
            print(f"Arquivo: {last_trace.filename}")
            print(f"Linha: {last_trace.lineno}")
            print(f"Função: {last_trace.name}")
            raise e 

        if tags:
            for tag in tags:
                titulo_tag = tag.titulo
                area_tag = tag.area_envolvida
                tag_id = self.tag_service.criar_ou_buscar_tag(titulo_tag, area_tag)
                self.projeto_repository.associar_tag_projeto(projeto_id, tag_id)

        return projeto_id
    
    def listar_projetos_com_filtros(
            self, 
            cursos_id: Optional[str] = None, 
            status: Optional[str] = None, 
            aluno_id: Optional[int] = None, 
            orientador_id: Optional[int] = None, 
            pagina: Optional[int] = None,
            itens_por_pagina: Optional[int] = None,
            pesquisa: Optional[str] = None,
            periodos: Optional[str] = None,
        ):
        return self.projeto_repository.listar_projetos(cursos_id, status, aluno_id, orientador_id, pagina, itens_por_pagina, pesquisa, periodos)
    
    async def get_user_from_api(self, matr: str, access_token: str):
        url = "http://localhost:8000/api/v1/aluno/"+matr  

        cookies = {
            "auth_token": access_token  
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, cookies=cookies)
                response.raise_for_status()  
                return response.json()
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=str(exc))
        
    def get_pdf_path_by_id(self, projeto_id: int):
        return self.projeto_repository.get_projeto_by_id(projeto_id=projeto_id, colunas=['pdf_path'])