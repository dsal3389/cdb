import psycopg2
from typing import Annotated
from fastapi import Depends, HTTPException, status

from app.core.database import database_session
from app.core.security import oauth2_scheme, jwt_decode
from app.crud.user import get_user_by_email
from app.models import User


SessionDep = Annotated[psycopg2.extensions.connection, Depends(database_session)]


async def _get_current_user(
    session: SessionDep, token: Annotated[str, Depends(oauth2_scheme)]
):
    payload = jwt_decode(token)
    email = payload.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Couldn't validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    with session.cursor() as cursor:
        user = get_user_by_email(cursor, email=email)

    if user is None:
        raise HTTPException(detail="test")
    return user


CurrentUserDep = Annotated[User, Depends(_get_current_user)]
