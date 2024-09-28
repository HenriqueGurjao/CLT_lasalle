from pydantic import BaseModel
from typing import List, Optional
from app.ms.final_paper.domain.tag import TagSchema

class ProjetoFinalCreateSchema(BaseModel):
    curso_id: int
    orientador_id: int
    aluno_id: int
    titulo: str
    status: str
    tags: Optional[List[TagSchema]] = None

class ProjetoFiltroSchema(BaseModel):
    curso_id: Optional[List[int]] = None
    status: Optional[List[str]] = None
    aluno_id: Optional[List[int]] = None
    orientador_id: Optional[List[int]] = None