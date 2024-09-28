from fastapi import APIRouter, Depends, HTTPException
from app.user.domain.usuario import Aluno, Professor, UpdatePassword
from app.user.repositories.usuario_repository import UsuarioRepository
from app.user.services.usuario_services import UsuarioService

router = APIRouter()

def get_usuario_service() -> UsuarioService:
    usuario_repository = UsuarioRepository()
    return UsuarioService(usuario_repository)

@router.post("/coordenador/alunos", tags=["Coordenador"])
def criar_aluno(aluno: Aluno, usuario_service: UsuarioService = Depends(get_usuario_service)):
    try:
        usuario_service.registrar_aluno(aluno)
        return {"msg": "Aluno criado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/coordenador/professores/", tags=["Coordenador"])
def criar_professor(professor: Professor, usuario_service: UsuarioService = Depends(get_usuario_service)):
    try:
        usuario_service.registrar_professor(professor)
        return {"msg": "Professor criado com sucesso"} 
    except Exception as e: 
        raise HTTPException(status_code=400, detail=str(e))
    
@router.put("/ativar_conta", tags=["Usuário"])
def ativar_conta(updatePassword: UpdatePassword, usuario_service: UsuarioService = Depends(get_usuario_service)):
    try:
        usuario_service.activate_account(updatePassword.matricula, updatePassword.password, updatePassword.new_password)
        return {"msg": "Conta ativada com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/aluno/{matricula}", tags=["Aluno"])
def get_usuario(matricula: str, usuario_service: UsuarioService = Depends(get_usuario_service)):
    try:
        return usuario_service.get_student_by_matricula(matricula)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/professor/{matricula}", tags=["Professor"])
def get_professor(matricula: str, usuario_service: UsuarioService = Depends(get_usuario_service)):
    try:
        return usuario_service.get_student_by_matricula(matricula) #mudar depois
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.put("/atualizar_senha", tags=["Usuário"])
def atualizar_senha(updatePassword: UpdatePassword, usuario_service: UsuarioService = Depends(get_usuario_service)):
    try:
        usuario_service.update_user_password(updatePassword.matricula, updatePassword.password, updatePassword.new_password)
        return {"msg": "Senha atualizada com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

