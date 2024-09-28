from app.db.connection import get_db_connection
from fastapi import HTTPException
from psycopg2 import sql

class CursoRepository:
    def __init__(self):
        pass

    def criar_curso(self, nome: str, descricao: str, periodo: str):
        conn = get_db_connection()

        if conn is None:
            raise HTTPException(status_code=500, detail="Erro ao conectar ao banco de dados.")

        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO CLT_LASALLE.cursos (nome, descricao, duracao)
                    VALUES (%s, %s, %s) RETURNING id
                """, (nome, descricao, periodo))
                curso_id = cursor.fetchone()[0]
                conn.commit()
            return curso_id
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Erro ao criar curso: {e}")
        finally:
            conn.close()

    def matricular_aluno_em_curso(self, matricula: str, curso_id: int, periodo):
        conn = get_db_connection()

        if conn is None:
            raise HTTPException(status_code=500, detail="Erro ao conectar ao banco de dados.")

        try:
            with conn.cursor() as cursor:
                # Executa o update com o join
                cursor.execute("""
                    UPDATE CLT_LASALLE.ALUNOS A
                    SET curso_id = %s, periodo = %s
                    FROM CLT_LASALLE.USUARIOS U
                    WHERE U.ID = A.USUARIO_ID
                    AND U.MATRICULA = %s
                    RETURNING A.ID;
                """, (curso_id, periodo, matricula))

                aluno_id = cursor.fetchone()

                if aluno_id is None:
                    raise HTTPException(status_code=404, detail="Matrícula não encontrada ou nenhum aluno foi atualizado.")

                conn.commit()
                return aluno_id[0] 

        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Erro ao matricular aluno: {e}")
        finally:
            conn.close()


    def alocar_professor_em_curso(self, professor_id: int, curso_id: int, periodo_inicio: str, periodo_fim: str, funcao: str):
        conn = get_db_connection()

        if conn is None:
            raise HTTPException(status_code=500, detail="Erro ao conectar ao banco de dados.")

        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO CLT_LASALLE.professor_curso (professor_id, curso_id, periodo_inicio, periodo_fim)
                    VALUES (%s, %s, %s, %s)
                """, (professor_id, curso_id, periodo_inicio, periodo_fim))
                conn.commit()
        except Exception as e:
            conn.rollback()
            raise HTTPException(status_code=500, detail=f"Erro ao alocar professor: {e}")
        finally:
            conn.close()

    def obter_todos_cursos(self):
        conn = get_db_connection()

        if conn is None:
            raise HTTPException(status_code=500, detail="Erro ao conectar ao banco de dados.")

        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id, nome, duracao, descricao FROM CLT_LASALLE.cursos")
                cursos = cursor.fetchall()
                return [
                    {"id": curso[0], "nome": curso[1], "periodos": curso[2], "descricao": curso[3]}
                    for curso in cursos
                ]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao obter cursos: {e}")
        finally:
            conn.close()

    def obter_cursos_resumidos(self):
        conn = get_db_connection()

        if conn is None:
            raise HTTPException(status_code=500, detail="Erro ao conectar ao banco de dados.")

        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id, nome FROM CLT_LASALLE.cursos")
                cursos = cursor.fetchall()
                return [{"id": curso[0], "nome": curso[1]} for curso in cursos]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao obter cursos: {e}")
        finally:
            conn.close()
