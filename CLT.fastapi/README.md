## Instalar o pyenv
Invoke-WebRequest -UseBasicParsing -Uri "https://raw.githubusercontent.com/pyenv-win/pyenv-win/master/pyenv-win/install-pyenv-win.ps1" -OutFile "./install-pyenv-win.ps1"; &"./install-pyenv-win.ps1"

## Instalar versões do Python, através do pyenv
pyenv install 3.11.2

## Configuração de versão local (Para o projeto especifico)
pyenv local 3.11.2

## 'Instalar' o venv
python -m venv .venv 
# Obs importante: O comando acima irá criar uma pasta oculta dentro do seu projeto
# ou seja, é necessário configurar para sua IDE enxergar os arquivos ocultos
# caso não esteja aparecendo. Também é importante configurar para que o 
# interpretador da sua IDE utilize o python.exe da pasta .venv, como no exemplo:

## Ativando o .venv
## Dentro da pasta raiz do projeto onde se encontra a pasta .venv, utilize o comando:
source .venv/Scripts/Activate

## Obs: pode ocorrer de apenas mudar o interpretador e não ser necessário usar o c
## comando mas por garantia, recomendo que também o ative desta forma, após ativar
## notará que em seu terminal, aparecerá (.venv), desta forma:

para descobrir o caminho do seu interpretador pyenv wich python

## Desativar .venv, rode o comando abaixo:
deactivate

## rodar em modo dev

- entrar no diretorio de services dentro da CLT.fastapi e rodar o seguinte comando:
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload