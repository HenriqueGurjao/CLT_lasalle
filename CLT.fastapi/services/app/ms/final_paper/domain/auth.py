from pydantic import BaseModel

class LoginRequest(BaseModel):
    matricula: str
    senha: str
