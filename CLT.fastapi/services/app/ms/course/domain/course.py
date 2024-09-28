from pydantic import BaseModel, EmailStr
from typing_extensions import Annotated
from pydantic import StringConstraints, field_validator
from typing import Optional

class CursoCreateSchema(BaseModel):
    nome: Annotated[str, StringConstraints(min_length=3, max_length=255)]
    descricao: Annotated[str, StringConstraints(min_length=10, max_length=1000)]
    periodo: str

    @field_validator('periodo', mode='before', check_fields=False)
    def periodo_valido(cls, value):
        if not value.isnumeric():
            raise ValueError('Período deve conter apenas números.')
        return value

class MatriculaSchema(BaseModel):
    matricula: str
    curso_id: int
    periodo: int

    @field_validator('matricula', mode='before', check_fields=False)
    def matricula_valida(cls, value):
        if not value.startswith("00500") or value.startswith("00700"):
            raise ValueError('Matrícula deve começar com 202.')
        return value

class ProfessorCursoSchema(BaseModel):
    professor_id: int
    curso_id: int
    funcao: str
    periodo_inicio: str
    periodo_fim: Optional[str] = None
