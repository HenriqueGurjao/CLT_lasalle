from pydantic import BaseModel, EmailStr
from enum import Enum

class Status(str, Enum):
    CURSANDO = "CURSANDO"
    TRANCADO = "TRANCADO"
    CONCLUIDO = "CONCLUIDO" 
    
class Usuario(BaseModel):
    email: EmailStr
    nome: str
    senha: str
    matricula: str
    ativo: bool = False

class Aluno(Usuario):
    periodo: str  
    status: Status
    curso: str 
    

# Subclasse Professor
class Professor(Usuario):
    departamento: str  
    titulacao: str
    funcao: str 

class UpdatePassword(BaseModel):
    new_password: str
    password: str
    matricula: str