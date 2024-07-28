from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Body, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import create_access_token, hash_password
from app.depends import SessionDep, CurrentUserDep
from app.models import Token, CreateUser
from app.crud import profile, user


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    session: SessionDep, user_schema: Annotated[CreateUser, Body(embed=False)]
) -> None:
    with session.cursor() as cursor:
        created_user_id = user.create(
            cursor,
            username=user_schema.username,
            email=user_schema.email,
            password=user_schema.password,
        )
        profile.create(cursor, created_user_id)

    session.commit()


@router.post("/token")
async def token(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    hashed_password = hash_password(form_data.password)

    with session.cursor() as cursor:
        user_ = user.get(
            cursor,
            where=(user.T.email == form_data.username)
            & (user.T.password_hash == hashed_password),
        )

    if user_ is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="incorrect email or password",
        )
    token = create_access_token({"email": user_.email})
    return Token(access_token=token, token_type="bearer")


@router.get("/me")
async def current_user(session: SessionDep, user: CurrentUserDep):
    with session.cursor() as cursor:
        return profile.get_brief(cursor, str(user.id))
