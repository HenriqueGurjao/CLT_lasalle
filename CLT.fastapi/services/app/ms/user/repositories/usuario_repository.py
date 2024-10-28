from fastapi.responses import JSONResponse
from app.ms.user.domain.usuario import Usuario, Aluno, Professor
from app.db.connection import get_db_connection
from app.core.security import hash_password
from fastapi import HTTPException, Request
from starlette.responses import RedirectResponse

class UsuarioRepository:
    def __init__(self):
        pass 

    def usuario_existe(self, email: str) -> bool:
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM CLT_LASALLE.usuarios WHERE email = %s", (email,))
                count = cursor.fetchone()[0]
            return count > 0
        except Exception as e:
            raise Exception (f"Erro ao verificar usuário: {e}")
        finally:
            conn.close()

    def find_user_permissions(self, matricula: str):
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                                SELECT funcao FROM CLT_LASALLE.PROFESSORES P 
                                INNER JOIN CLT_LASALLE.USUARIOS U 
                                ON P.USUARIO_ID = U.ID
                                WHERE u.MATRICULA = %s;""", (matricula,)
                            )
                role = cursor.fetchone()[0]
            return role
        except Exception as e:
            return "ALUNO"
            # raise Exception (f"Erro ao verificar permissões do usuário: {e} {matricula}")
        finally:
            conn.close

    def criar_usuario(self, usuario: Usuario):
            
        conn = get_db_connection() 
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO CLT_LASALLE.usuarios (email, nome, senha, matricula, ativo)
                    VALUES (%s, %s, %s, %s, %s) RETURNING id
                """, (usuario.email, usuario.nome, hash_password(usuario.senha), usuario.matricula, usuario.ativo))
                usuario_id = cursor.fetchone()[0]
                conn.commit() 
            return usuario_id
        except Exception as e:
            conn.rollback()  
            raise Exception(f"Erro ao criar usuário: {str(e)}")
        finally:
            conn.close()  

    def criar_aluno(self, aluno: Aluno):
        # if self.usuario_existe(aluno.email):
        #     usuario_id = self.obter_usuario_id(aluno.email)
        # else:
        #     usuario_id = self.criar_usuario(aluno)

        if self.usuario_existe(aluno.email):
            raise HTTPException(status_code=400, detail="Email já cadastrado.")
        
        usuario_id = self.criar_usuario(aluno)
        
        if aluno.email.startswith("prof."):
            raise Exception('O email do aluno não pode começar com "prof.".')
        else:
            conn = get_db_connection()  
            try:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        INSERT INTO CLT_LASALLE.alunos (usuario_id, periodo, status)
                        VALUES (%s, %s, %s)
                    """, (usuario_id, aluno.periodo, aluno.status.value))
                    conn.commit()
            except Exception as e:
                conn.rollback()  
                raise Exception(f"Erro ao criar aluno: {str(e)}")
            finally:
                conn.close() 

    def obter_usuario_id(self, email: str) -> int:
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT id FROM CLT_LASALLE.usuarios WHERE email = %s", (email,))
                usuario_id = cursor.fetchone()[0]
                return usuario_id
        except Exception as e:
            raise Exception(f"Erro ao obter ID do usuário: {e}")
        finally:
            conn.close()

    def obter_senha_usuario_por_matricula(self, matricula: str) -> int:
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT senha, matricula FROM CLT_LASALLE.usuarios WHERE matricula = %s", (matricula,))
                result = cursor.fetchone()  
                if result is None:
                    raise HTTPException(status_code=404, detail="Matrícula não encontrada")  
                return result
        except Exception as e:
            raise HTTPException(status_code=404, detail="Matrícula não encontrada ")
        finally:
            conn.close()

    def obter_aluno_por_matricula(self, matricula: str) -> int:
        conn = get_db_connection()
        query = """
                    SELECT nome, matricula, periodo, curso_id, email, status, data_ingressao, usuario_id FROM CLT_LASALLE.ALUNOS A
                    INNER JOIN CLT_LASALLE.USUARIOS U 
                    ON A.USUARIO_ID = U.ID
                    WHERE matricula = %s;
                """
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, (matricula,))
                result = cursor.fetchone()  
                if result is None:
                    raise HTTPException(status_code=404, detail="Matrícula não encontrada")  
                aluno_dict = {
                    "nome": result[0],
                    "matricula": result[1],
                    "periodo": result[2],
                    "curso": result[3],
                    "email": result[4],
                    "status": result[5],
                    "data_ingressao": result[6],
                    "id": result[7],
                }
                return aluno_dict
        except Exception as e:
            raise HTTPException(status_code=404, detail="Matrícula do aluno não encontrada ")
        finally:
            conn.close()

    def obter_professor_por_matricula(self, matricula: str):
        conn = get_db_connection()
        query = """
            SELECT nome, matricula, email, departamento, titulacao, funcao, p.id FROM CLT_LASALLE.PROFESSORES P
            INNER JOIN CLT_LASALLE.USUARIOS U 
            ON P.USUARIO_ID = U.ID
            WHERE matricula = %s;
        """
        try:
            with conn.cursor() as cursor:
                cursor.execute(query, (matricula,))
                result = cursor.fetchone()  
                if result is None:
                    raise HTTPException(status_code=404, detail="Matrícula do professor não encontrada")  
                # Verifique se o resultado está correto
                professor_dict = {
                    "nome": result[0],
                    "matricula": result[1],
                    "email": result[2],
                    "departamento": result[3],
                    "titulacao": result[4],
                    "funcao": result[5],
                    "id": result[6],
                }
                return professor_dict
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao obter professor: {str(e)}")
        finally:
            conn.close()

    def criar_professor(self, professor: Professor):
        # if self.usuario_existe(professor.email):
        #     usuario_id = self.obter_usuario_id(professor.email)
        # else:
        #     usuario_id = self.criar_usuario(professor)

        if self.usuario_existe(professor.email):
            raise HTTPException(status_code=400, detail="Email já cadastrado.")
        else:
        
            usuario_id = self.criar_usuario(professor)

            if professor.email.startswith("prof."):
                conn = get_db_connection()  
                try:
                    with conn.cursor() as cursor:
                        cursor.execute("""
                            INSERT INTO CLT_LASALLE.professores (usuario_id, departamento, titulacao, funcao)
                            VALUES (%s, %s, %s, %s)
                        """, (usuario_id, professor.departamento, professor.titulacao, professor.funcao))
                        conn.commit()
                except Exception as e:
                    conn.rollback() 
                    raise Exception(f"Erro ao criar professor: {str(e)}")
                finally:
                    conn.close()
            else:       
                raise Exception('O email do professor deve começar com "prof.".') 

    def update_user_password(self, matricula, new_password):
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("UPDATE CLT_LASALLE.usuarios SET senha = %s WHERE matricula = %s", (hash_password(new_password), matricula))
                conn.commit()
        except Exception as e:
            conn.rollback()  
            raise Exception(f"Erro ao atualizar senha: {str(e)}")
        finally:
            conn.close()

    def activate_account(self, matricula):
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("UPDATE CLT_LASALLE.usuarios SET ativo = TRUE WHERE matricula = %s", (matricula,))
                conn.commit()
        except Exception as e:
            conn.rollback()  
            raise Exception(f"Erro ao ativar conta: {str(e)}")
        finally:
            conn.close()

    def is_user_active(self, matricula: str):
        if matricula is None:
            return JSONResponse(status_code=403, content={"detail": "Matrícula não fornecida no token"})
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT ativo FROM CLT_LASALLE.usuarios WHERE matricula = %s", (matricula,))
                result = cursor.fetchone()
                if result is None or not result[0]:# Se não encontrado ou não ativo
                    return False
                    # return RedirectResponse(url="/ativar-conta")  # Altere para sua rota de ativação
                # return result[0]
        except Exception as e:
            raise HTTPException(status_code=500, detail="Erro ao verificar status do usuário")
        finally:
            conn.close()

        return True
