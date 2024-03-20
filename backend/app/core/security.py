import jwt
import hashlib
from typing import Optional
from datetime import datetime, timedelta, timezone

from fastapi.security import OAuth2PasswordBearer
from app.core.settings import settings


JWT_SECRET_KEY = "secret"
JWT_ALGORTIHEM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


def jwt_encode(data: dict) -> str:
    return jwt.encode(data, JWT_SECRET_KEY, algorithm=JWT_ALGORTIHEM)


def jwt_decode(data: str) -> dict:
    return jwt.decode(data, JWT_SECRET_KEY, algorithms=(JWT_ALGORTIHEM,))


def hash_password(password: str) -> str:
    sha = hashlib.sha256()
    sha.update(password.encode("utf-8"))
    return sha.hexdigest()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expires = datetime.now(timezone.utc) + expires_delta
    else:
        expires = datetime.now(timezone.utc) + timedelta(
            minutes=settings.TOKEN_VALID_MINUTES
        )
    to_encode.update({"exp": expires})
    return jwt_encode(to_encode)
