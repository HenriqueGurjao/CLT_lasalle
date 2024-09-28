from fastapi import HTTPException
from app.db.connection import get_db_connection

class TagRepository:
    def criar_tag(self, titulo: str, area_envolvida: str):
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO CLT_LASALLE.tag (titulo, area_envolvida)
                    VALUES (%s, %s) RETURNING id
                """, (titulo, area_envolvida))
                tag_id = cursor.fetchone()[0]
                conn.commit()
                return tag_id
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Erro ao criar tag: {e}")
        finally:
            conn.close()

    def buscar_tag_por_titulo_e_area(self, titulo: str, area_envolvida: str):
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT id FROM CLT_LASALLE.tag
                    WHERE titulo = %s AND area_envolvida = %s
                """, (titulo, area_envolvida))
                tag = cursor.fetchone()
                return tag[0] if tag else None
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao buscar tag: {e}")
        finally:
            conn.close()
