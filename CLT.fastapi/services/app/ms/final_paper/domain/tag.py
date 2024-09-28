from pydantic import BaseModel

class TagSchema(BaseModel):
    titulo: str
    area_envolvida: str