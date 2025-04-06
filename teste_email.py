import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders 
from email.utils import COMMASPACE

# Configurações do servidor SMTP
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_USUARIO = "unilasalle.clt@gmail.com"
EMAIL_SENHA = "umxu cngk chlx rhcy"

destinatarios = ["brunocunha86@gmail.com"]

# Criando o e-mail
msg = MIMEMultipart()
msg["From"] = EMAIL_USUARIO
msg["To"] = COMMASPACE.join(destinatarios)
msg["Subject"] = "Projeto final recusado!"
msg.attach(MIMEText(""""
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ativação de Conta</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 30px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
        }
        p {
            color: #555;
            font-size: 14px;
            line-height: 1.6;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            background-color: #4CAF50;
            border-radius: 5px;
            text-decoration: none;
            margin: 20px 0;
        }
        .footer {
            font-size: 12px;
            color: #888;
            text-align: center;
            margin-top: 20px;
        }
        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }
    </style>
</head>
<body>

    <div class="container">
        <h2>Olá, Gabriel Eiki!</h2>

        <p>Identificamos que o seu TCC feriu as diretrizes academicas:</p>

        <a href="https://chatgpt.com/" class="btn">Corrigir urgente</a>

        <p>Caso não tenha se registrado em nosso site, por favor, desconsidere este e-mail.</p>

        <div class="footer">
            <p><strong>⚠️ Importante:</strong></p>
            <p>Este e-mail foi enviado automaticamente, por isso, <strong>não responda</strong> a esta mensagem.</p>
            <p>Se você tiver alguma dúvida, por favor de uma mamada aqui, glub glub. ASS Gurjao de flango <3 <a href="mailto:suporte@exemplo.com">suporte@exemplo.com</a>.</p>
        </div>
    </div>

</body>
</html>
                    """, "html"))

try:
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()  
    server.login(EMAIL_USUARIO, EMAIL_SENHA)
    
    server.sendmail(EMAIL_USUARIO, msg["To"], msg.as_string())
    print("E-mail enviado com sucesso!")
    
    server.quit()
except Exception as e:
    print(f"Erro ao enviar e-mail: {e}")
