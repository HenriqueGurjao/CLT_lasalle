class body_email_templates:
    @staticmethod
    def recovery_password_email_body(nome: str, link: str):
        return f"""\
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }}
        h2 {{
            color: #333;
        }}
        p {{
            color: #555;
            font-size: 15px;
            line-height: 1.6;
        }}
        .btn {{
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            background-color: #007BFF;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
        }}
        .footer {{
            font-size: 12px;
            color: #888;
            text-align: center;
            margin-top: 20px;
        }}
        .footer a {{
            color: #007BFF;
            text-decoration: none;
        }}
    </style>
</head>
<body>

    <div class="container">
        <h2>Olá, {nome}!</h2>

        <p>Recebemos uma solicitação para redefinir a sua senha.</p>
        <p>Para continuar com o processo, clique no botão abaixo:</p>

        <a href="{link}" class="btn">Redefinir Senha</a>

        <p>Se você não solicitou a redefinição de senha, ignore este e-mail. Sua senha atual permanecerá a mesma.</p>

        <div class="footer">
            <p>Este e-mail foi enviado automaticamente. Não responda a esta mensagem.</p>
            <p>Em caso de dúvidas, entre em contato com nosso suporte: <a href="mailto:ascom@lasalle.org.br">ascom@lasalle.org.br</a></p>
        </div>
    </div>

</body>
</html>
"""
