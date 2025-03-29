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
            print(e)
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

            
    def listar_projetos(self, cursos_id: Optional[str] = None, status: Optional[List[str]] = None, aluno_id: Optional[List[int]] = None, orientador_id: Optional[List[int]] = None, pagina: Optional[List[int]] = None, itens_por_pagina: Optional[List[int]] = None, pesquisa: Optional[str] = None, periodos: Optional[str] = None):
        conn = get_db_connection()
        

        query = f"""
            SELECT DISTINCT 
                p.id, 
                p.titulo, 
                p.data_registro, 
                p.status, 
                c.nome as curso_nome, 
                u_aluno.nome as aluno_nome, 
                u_orientador.nome as orientador_nome,
                p.data_apresentacao
            FROM CLT_LASALLE.PROJETO_FINAL P
            LEFT JOIN CLT_LASALLE.TAG_PROJETO TP ON TP.ID_PROJETO = P.ID
            LEFT JOIN CLT_LASALLE.TAG T ON T.ID = TP.ID_TAG
            LEFT JOIN CLT_LASALLE.CURSOS C ON C.ID = P.CURSO_ID 
            INNER JOIN CLT_LASALLE.alunos a ON P.aluno_id = a.id
            INNER JOIN CLT_LASALLE.usuarios u_aluno ON a.usuario_id = u_aluno.id 
            INNER JOIN CLT_LASALLE.professores o ON P.orientador_id = o.id
            INNER JOIN CLT_LASALLE.usuarios u_orientador ON o.usuario_id = u_orientador.id
        """

        query_contagem = f"""
            SELECT
                (COUNT(*) / {itens_por_pagina[0]}) AS total_paginas
            FROM CLT_LASALLE.PROJETO_FINAL P
            LEFT JOIN CLT_LASALLE.TAG_PROJETO TP ON TP.ID_PROJETO = P.ID
            LEFT JOIN CLT_LASALLE.TAG T ON T.ID = TP.ID_TAG
            LEFT JOIN CLT_LASALLE.CURSOS C ON C.ID = P.CURSO_ID 
            INNER JOIN CLT_LASALLE.alunos a ON P.aluno_id = a.id
            INNER JOIN CLT_LASALLE.usuarios u_aluno ON a.usuario_id = u_aluno.id 
            INNER JOIN CLT_LASALLE.professores o ON P.orientador_id = o.id
            INNER JOIN CLT_LASALLE.usuarios u_orientador ON o.usuario_id = u_orientador.id
        """

        if pesquisa or cursos_id or periodos:
            termo = """    WHERE 
                ("""
            query += termo
            query_contagem += termo
        
        filters = []
        params = []

        # Filtro para status (múltiplos)
        # if status:
        #     filters.append(f"p.status IN ({','.join(['%s'] * len(status))})")
        #     params.extend(status)

        if pesquisa:
            termo = f"""
                    (
                        string_to_array(LOWER(p.TITULO), ' ') && string_to_array(LOWER('{pesquisa}'), ' ')
                        OR EXISTS (
                            SELECT 1
                            FROM CLT_LASALLE.TAG_PROJETO TP2
                            INNER JOIN CLT_LASALLE.TAG T2 ON TP2.ID_TAG = T2.ID
                            WHERE TP2.ID_PROJETO = P.ID
                            AND string_to_array(LOWER(T2.titulo), ' ') && string_to_array(LOWER('{pesquisa}'), ' ')
                        )
                    )
            """
            query += termo
            query_contagem += termo
            # params.extend(['%' + pesquisa + '%', '%' + pesquisa + '%', '%' + pesquisa + '%'])
            # params.extend([pesquisa, pesquisa])
            # params.extend([pesquisa])
            
        if cursos_id:
            cursos = cursos_id.split('-')
            filters.append(f"c.id IN ({','.join(['%s'] * len(cursos))})")
            params.extend(cursos)

        if periodos:
            periodos = periodos.split('-')
            filters.append(f"DATE_PART('year', COALESCE(DATA_APRESENTACAO, DATA_REGISTRO))::int in ({','.join(['%s'] * len(periodos))})")
            params.extend(periodos)
        # Adiciona os filtros à query
        
        
        if filters and pesquisa:
            termo = "          AND "+" AND ".join(filters)
            termo += """
                )"""
            query_contagem += termo
            query += termo
        elif filters:
            termo = " AND ".join(filters)
            termo += ")"
            query_contagem += termo
            query += termo
        elif pesquisa:
            termo = ")"
            query += termo
            query_contagem += termo

        termo = f"""
            GROUP BY p.id, p.titulo, p.data_registro, p.status, c.nome, u_aluno.nome, u_orientador.nome, p.data_apresentacao
            ORDER BY p.DATA_REGISTRO desc
            LIMIT {itens_por_pagina[0]} OFFSET ({pagina[0]} - 1) * {itens_por_pagina[0]};
        """
        # query_contagem += termo
        query += termo

        print(pesquisa, cursos_id, periodos)
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, tuple(params))
                projetos = cursor.fetchall()

            with conn.cursor() as cursor:
                cursor.execute(query_contagem, tuple(params) )
                total = cursor.fetchall()
                
        except Exception as e:
            print(f"Erro ao executar query: {e}")
            print("Query que falhou:", query if 'projetos' not in locals() else query_contagem)
            raise HTTPException(status_code=500, detail=f"Erro na consulta: {e}")

        finally:
            conn.close()

        total_pages = total[0][0] if total else 0
        return {
            "projetos": [
                {
                    "id": projeto[0],
                    "titulo": projeto[1],
                    "data_registro": projeto[2],
                    "status": projeto[3],
                    "curso_nome": projeto[4],
                    "aluno_nome": projeto[5],
                    "orientador_nome": projeto[6],
                    "data_apresentacao": projeto[7]
                }
                for projeto in projetos
            ],
            "total_pages": total_pages
        }
        