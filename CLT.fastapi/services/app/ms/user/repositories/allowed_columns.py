
ALUNO_ALLOWED_COLUMNS = {
    "id": "a.id",
    "matricula": "a.matricula",
    "curso_id": "a.curso_id",
    "usuario_id": "a.usuario_id",
    "nome": "u.nome",
    "email": "u.email",
    "cpf": "u.cpf",
}

PROFESSOR_ALLOWED_COLUMNS = {
    "id": "p.id",
    "matricula": "p.matricula",
    "area_atuacao": "p.area_atuacao",
    "usuario_id": "p.usuario_id",
    "nome": "u.nome",
    "email": "u.email",
    "cpf": "u.cpf",
}

def get_aluno_allowed_columns():
    return ALUNO_ALLOWED_COLUMNS

def get_professor_allowed_columns():
    return PROFESSOR_ALLOWED_COLUMNS

