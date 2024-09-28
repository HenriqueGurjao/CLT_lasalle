from typing import List, Optional
from fastapi import HTTPException
from app.db.connection import get_db_connection

class ProjetoFinalRepository:
    def criar_projeto_final(self, curso_id: int, orientador_id: int, aluno_id: int, titulo: str, status: str, pdf_path: str = None):
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO CLT_LASALLE.projeto_final (curso_id, orientador_id, aluno_id, titulo, status, pdf_path)
                    VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
                """, (curso_id, orientador_id, aluno_id, titulo, status, pdf_path))
                projeto_id = cursor.fetchone()[0]
                conn.commit()
                return projeto_id
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Erro ao criar projeto final: {e}")
        finally:
            conn.close()

    def associar_tag_projeto(self, projeto_id: int, tag_id: int):
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO CLT_LASALLE.tag_projeto (id_projeto, id_tag)
                    VALUES (%s, %s)
                """, (projeto_id, tag_id))
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Erro ao associar tag ao projeto: {e}")
        finally:
            conn.close()

            
    def listar_projetos(self, curso_id: Optional[List[int]] = None, status: Optional[List[str]] = None, aluno_id: Optional[List[int]] = None, orientador_id: Optional[List[int]] = None):
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                # Query base
                query = """
                    SELECT p.id, p.titulo, p.data_registro, p.status, c.nome as curso_nome, u_aluno.nome as aluno_nome, u_orientador.nome as orientador_nome
                    FROM CLT_LASALLE.projeto_final p
                    INNER JOIN CLT_LASALLE.cursos c ON p.curso_id = c.id
                    INNER JOIN CLT_LASALLE.alunos a ON p.aluno_id = a.id
                    INNER JOIN CLT_LASALLE.usuarios u_aluno ON a.usuario_id = u_aluno.id 
                    INNER JOIN CLT_LASALLE.professores o ON p.orientador_id = o.id
                    INNER JOIN CLT_LASALLE.usuarios u_orientador ON o.usuario_id = u_orientador.id
                """
                filters = []
                params = []

                # Filtro para cursos (múltiplos)
                if curso_id:
                    filters.append(f"p.curso_id IN ({','.join(['%s'] * len(curso_id))})")
                    params.extend(curso_id)

                # Filtro para status (múltiplos)
                if status:
                    filters.append(f"p.status IN ({','.join(['%s'] * len(status))})")
                    params.extend(status)

                # Filtro para alunos (múltiplos)
                if aluno_id:
                    filters.append(f"p.aluno_id IN ({','.join(['%s'] * len(aluno_id))})")
                    params.extend(aluno_id)

                # Filtro para orientadores (múltiplos)
                if orientador_id:
                    filters.append(f"p.orientador_id IN ({','.join(['%s'] * len(orientador_id))})")
                    params.extend(orientador_id)

                # Adiciona os filtros à query
                if filters:
                    query += " WHERE " + " AND ".join(filters)

                # Ordenar por data mais recente
                query += " ORDER BY p.data_registro DESC"

                cursor.execute(query, tuple(params))
                projetos = cursor.fetchall()

                return [
                    {
                        "id": projeto[0],
                        "titulo": projeto[1],
                        "data_registro": projeto[2],
                        "status": projeto[3],
                        "curso_nome": projeto[4],
                        "aluno_nome": projeto[5],
                        "orientador_nome": projeto[6]
                    }
                    for projeto in projetos
                ]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao listar projetos: {e}")
        finally:
            conn.close()
