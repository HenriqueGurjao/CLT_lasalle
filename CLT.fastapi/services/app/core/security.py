import os
from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv
from passlib.context import CryptContext
from cryptography.fernet import Fernet
import os

# Gera uma chave secreta
# key = Fernet.generate_key()

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
HASH_SECRET = os.getenv("HASH_SECRET").encode()
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
PUBLIC_ROUTES = ["/api/v1/auth/login", "/api/v1/public"]

cipher_suite = Fernet(HASH_SECRET)
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(payload)
        return payload
    except JWTError:
        return None

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def encrypt_token(token: str) -> str:
    return cipher_suite.encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    return cipher_suite.decrypt(encrypted_token.encode()).decode()