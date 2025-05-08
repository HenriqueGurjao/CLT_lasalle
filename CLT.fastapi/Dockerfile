FROM python:3.11.2-slim
# Define diretório de trabalho
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    postgresql libpq-dev \
    curl \
    gnupg2 \
    apt-transport-https \
    build-essential \
    unixodbc \
    unixodbc-dev \
    freetds-dev \
    freetds-bin \
    tdsodbc \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# Copia apenas o necessário
COPY services /app
# Copia e instala dependências
COPY requirements.txt /app/
RUN --mount=type=cache,target=/root/.cache/pip \
    python -m pip install -r requirements.txt

RUN pip install -U python-dotenv
# Copia o restante dos arquivos do projeto
COPY . .

EXPOSE 8000

CMD ["python", "services.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]

