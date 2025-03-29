from typing import Optional
from app.ms.final_paper.repositories.projeto_final_repository import ProjetoFinalRepository
from app.ms.final_paper.services.tag_service import TagService
from fastapi import FastAPI, HTTPException
import httpx
from typing import List

class ProjetoFinalService:
    def __init__(self, projeto_repository: ProjetoFinalRepository, tag_service: TagService):
        self.projeto_repository = projeto_repository
        self.tag_service = tag_service

    def criar_projeto_com_tags(self, curso_id: int, orientador_id: int, aluno_id: int, titulo: str, status: str, pdf_path: str = None, tags: list = None):
        pdf_path = "" + str(curso_id) + "/" + str(orientador_id) + "/" + titulo + "_" + str(aluno_id) + ".pdf"

        projeto_id = self.projeto_repository.criar_projeto_final(curso_id, orientador_id, aluno_id, titulo, status, pdf_path)

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
        url = "http://localhost:8000/api/v1/aluno/"+matr  # Substitua com o URL da API externa

        cookies = {
            "auth_token": access_token  # Definindo o token como um cookie
        }

        try:
            async with httpx.AsyncClient() as client:
                # Envia o cookie com o access_token
                response = await client.get(url, cookies=cookies)
                response.raise_for_status()  
                return response.json()
        except httpx.HTTPStatusError as exc:
            raise HTTPException(status_code=exc.response.status_code, detail=str(exc))
