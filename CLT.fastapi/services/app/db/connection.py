import psycopg2

# Configurações do banco de dados
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "admin"
DB_SCHEMA = "clt_lasalle"

# Função para criar a conexão
def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        options=f'-c search_path={DB_SCHEMA}'
    )
    return conn
