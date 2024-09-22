from fastapi import FastAPI, Request
from app.user.api.v1.usuario_router import router as usuario_router
from app.user.api.v1.auth_router import router as auth_router
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from app.core.security import verify_access_token
from jose import jwt
from datetime import datetime, timezone

app = FastAPI(
    title="API de Usuários",
    description="API de gerenciamento de usuários",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://meudominio.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True, 
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    print(f"Requisição para: {request.url.path}")

    if request.url.path == "/api/v1/auth/login":
        return await call_next(request)

    token = request.headers.get("Authorization")
    print(f"Token recebido: {token}")

    if token is None:
        return JSONResponse(status_code=401, content={"detail": "Token não encontrado"})
    
    try:
        if " " in token:
            token_value = token.split(" ")[1]
        else:
            return JSONResponse(status_code=401, content={"detail": "Formato do token inválido"})

        print(f"Token sem 'Bearer': {token_value}")

        payload = verify_access_token(token_value)

        if payload is None:
            return JSONResponse(status_code=401, content={"detail": "Token inválido"})

        exp = payload.get("exp")
        print(f"Expiração do token: {exp}")

        if exp is None:
            return JSONResponse(status_code=403, content={"detail": "Token sem expiração"})

        exp_datetime = datetime.fromtimestamp(exp, tz=timezone.utc)
        print(f"Data e hora de expiração do token: {exp_datetime}")

        if datetime.now(timezone.utc) > exp_datetime:
            return JSONResponse(status_code=403, content={"detail": "Token expirado"})

    except (jwt.JWTError, IndexError) as e:
        print(f"Erro ao verificar token: {e}")
        return JSONResponse(status_code=401, content={"detail": "Token inválido"})

    response = await call_next(request)
    return response

app.include_router(usuario_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
