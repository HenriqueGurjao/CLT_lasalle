import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email.utils import COMMASPACE
from email import encoders
from typing import List, Optional

class EmailSender:
    def __init__(
        self,
        smtp_server: str = os.getenv("SMTP_SERVER"),
        smtp_port: int = int(os.getenv("SMTP_PORT", "587")),
        email_usuario: str = os.getenv("EMAIL_USUARIO"),
        email_senha: str = os.getenv("EMAIL_SENHA")
    ):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.email_usuario = email_usuario
        self.email_senha = email_senha

    def send_email(
        self,
        destinatarios: List[str],
        subject: str,
        html_body: str,
        copias: Optional[List[str]] = None,
        attachments: Optional[List[str]] = None
    ):
        copias = copias or []
        attachments = attachments or []

        msg = MIMEMultipart()
        msg["From"] = "UniLaSalle-CLT"
        msg["To"] = COMMASPACE.join(destinatarios)
        msg["Cc"] = COMMASPACE.join(copias)
        msg["Subject"] = subject

        msg.attach(MIMEText(html_body, "html"))

        for filepath in attachments:
            if not os.path.isfile(filepath):
                print(f"⚠️ Arquivo não encontrado: {filepath}")
                continue

            try:
                with open(filepath, "rb") as file:
                    part = MIMEBase("application", "octet-stream")
                    part.set_payload(file.read())
                    encoders.encode_base64(part)
                    part.add_header(
                        "Content-Disposition",
                        f"attachment; filename={os.path.basename(filepath)}"
                    )
                    msg.attach(part)
            except Exception as e:
                print(f"❌ Erro ao anexar {filepath}: {e}")

        try:
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email_usuario, self.email_senha)

            all_recipients = destinatarios + copias
            server.sendmail(self.email_usuario, all_recipients, msg.as_string())
            print("✅ E-mail enviado com sucesso!")

            server.quit()
        except Exception as e:
            print(f"❌ Erro ao enviar e-mail: {e}")
