from app.ms.final_paper.repositories.tag_repository import TagRepository

class TagService:
    def __init__(self, tag_repository: TagRepository):
        self.tag_repository = tag_repository

    def criar_ou_buscar_tag(self, titulo: str, area_envolvida: str):
        tag_id = self.tag_repository.buscar_tag_por_titulo_e_area(titulo, area_envolvida)
        if not tag_id:
            tag_id = self.tag_repository.criar_tag(titulo, area_envolvida)
        return tag_id
