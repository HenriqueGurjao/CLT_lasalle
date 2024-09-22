from fastapi import Request
from jose import JWTError, jwt
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from app.core.security import  PUBLIC_ROUTES

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        print(f"Middleware chamado para {request.url.path}")

        if any(request.url.path.startswith(route) for route in PUBLIC_ROUTES):
            return await call_next(request)

        token = request.headers.get("Authorization")
        if not token:
            return JSONResponse(status_code=403, content={"detail": "Token não fornecido"})

        try:
            token = token.split(" ")[1]
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            
            request.state.user = payload

        except JWTError:
            return JSONResponse(status_code=401, content={"detail": "Token inválido"})

        response = await call_next(request)
        return response
