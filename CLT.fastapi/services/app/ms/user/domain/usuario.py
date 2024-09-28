from pydantic import BaseModel, EmailStr

class Usuario(BaseModel):
    email: EmailStr
    nome: str
    senha: str
    matricula: str
    ativo: bool = False

class Aluno(Usuario):
    periodo: str  
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