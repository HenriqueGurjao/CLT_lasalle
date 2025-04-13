import os
from typing import Optional
base_url_env = os.getenv("API_BASE_URL", "http://localhost:8000")

class BannerService:
    def __init__(self, repository, base_url=base_url_env):
        self.repository = repository
        self.base_url = base_url
    def construir_banner_url(self, pdf_path: str) -> Optional[str]:
        if not pdf_path:
            return None

        try:
            dir_path, filename = os.path.split(pdf_path)
            name, _ = os.path.splitext(filename)
            banner_filename = f"{name}_capa.jpg"
            banner_full_path = os.path.join(dir_path, banner_filename)

            relative_path = os.path.relpath(banner_full_path, r"C:\projetos")
            relative_path = relative_path.replace("\\", "/")

            return f"{self.base_url}/media/{relative_path}"
        except Exception:
            return None
