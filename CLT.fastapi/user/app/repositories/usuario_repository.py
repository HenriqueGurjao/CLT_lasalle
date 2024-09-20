from app.domain.usuario import Usuario, Aluno, Professor
from app.db.connection import get_db_connection
from app.core.security import hash_password

class UsuarioRepository:
    def __init__(self):
        pass 

    def usuario_existe(self, email: str) -> bool:
        conn = get_db_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM usuarios WHERE email = %s", (email,))
                count = cursor.fetchone()[0]
            return count > 0
        except Exception as e:
            print(f"Erro ao verificar usuário: {e}")
            raise
        finally:
            conn.close()

    def criar_usuario(self, usuario: Usuario):
            
        conn = get_db_connection() 
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO usuarios (email, nome, senha, matricula)
                    VALUES (%s, %s, %s, %s) RETURNING id
                """, (usuario.email, usuario.nome, hash_password(usuario.senha), usuario.matricula))
                usuario_id = cursor.fetchone()[0]
                conn.commit()
            return usuario_id
        except Exception as e:
            print(f"Erro ao criar usuário: {e}")
            conn.rollback()  
            raise Exception(f"Erro ao criar usuário: {str(e)}")
        finally:
            conn.close()  

    def criar_aluno(self, aluno: Aluno):
        if self.usuario_existe(aluno.email):
            usuario_id = self.obter_usuario_id(aluno.email)
        else:
            usuario_id = self.criar_usuario(aluno)

        if aluno.email.startswith("prof."):
            raise Exception('O email do aluno não pode começar com "prof.".')

        conn = get_db_connection()  
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO alunos (usuario_id, periodo, curso)
                    VALUES (%s, %s, %s)
                """, (usuario_id, aluno.periodo, aluno.curso))
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
                cursor.execute("SELECT id FROM usuarios WHERE email = %s", (email,))
                usuario_id = cursor.fetchone()[0]
                return usuario_id
        except Exception as e:
            print(f"Erro ao obter ID do usuário: {e}")
            raise
        finally:
            conn.close()

    def criar_professor(self, professor: Professor):
        if self.usuario_existe(professor.email):
            usuario_id = self.obter_usuario_id(professor.email)
        else:
            usuario_id = self.criar_usuario(professor)

        if not professor.email.startswith("prof."):
            raise Exception('O email do professor deve começar com "prof.".')

        conn = get_db_connection()  
        try:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO professores (usuario_id, departamento, titulacao)
                    VALUES (%s, %s, %s)
                """, (usuario_id, professor.departamento, professor.titulacao))
                conn.commit()
        except Exception as e:
            conn.rollback() 
            raise Exception(f"Erro ao criar professor: {str(e)}")
        finally:
            conn.close()
