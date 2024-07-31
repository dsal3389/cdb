import jwt
import psycopg2
from typing import Annotated
from fastapi import Depends, HTTPException, status

from app.core.database import database_session
from app.core.security import oauth2_scheme, jwt_decode

from . import models, db

SessionDep = Annotated[psycopg2.extensions.connection, Depends(database_session)]


async def _get_current_user(
    session: SessionDep, token: Annotated[str, Depends(oauth2_scheme)]
):
    try:
        payload = jwt_decode(token)
    except jwt.exceptions.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is expired.",
        )

    email = payload.get("email")

    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Couldn't validate credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    with session.cursor() as cursor:
        user = db.find_user(cursor, where=(db.USER_TABLE.email == email))

    if user is None:
        raise HTTPException(
            detail="Couldn't find user.", status_code=status.HTTP_401_UNAUTHORIZED
        )
    return user


CurrentUserDep = Annotated[models.User, Depends(_get_current_user)]
