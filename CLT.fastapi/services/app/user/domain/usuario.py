from pydantic import BaseModel, EmailStr

class Usuario(BaseModel):
    email: EmailStr
    nome: str
    senha: str
    matricula: str 

class Aluno(Usuario):
    periodo: str  
    curso: str 
    

# Subclasse Professor
class Professor(Usuario):
    departamento: str  
    titulacao: str 
