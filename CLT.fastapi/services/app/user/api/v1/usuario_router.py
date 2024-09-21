from fastapi import APIRouter, Depends, HTTPException
from app.user.domain.usuario import Aluno, Professor
from app.user.repositories.usuario_repository import UsuarioRepository
from app.user.services.usuario_services import UsuarioService

router = APIRouter()

def get_usuario_service() -> UsuarioService:
    usuario_repository = UsuarioRepository()
    return UsuarioService(usuario_repository)

@router.post("/alunos")
def criar_aluno(aluno: Aluno, usuario_service: UsuarioService = Depends(get_usuario_service)):
    try:
        usuario_service.registrar_aluno(aluno)
        return {"msg": "Aluno criado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Criar professor
@router.post("/professores")
def criar_professor(professor: Professor, usuario_service: UsuarioService = Depends(get_usuario_service)):
    try:
        usuario_service.registrar_professor(professor)
        return {"msg": "Professor criado com sucesso"} 
    except Exception as e: 
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/")
async def root():
    return {"message": "Hello World"}
