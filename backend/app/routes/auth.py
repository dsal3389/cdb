from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Body, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import create_access_token
from app.crud.profile import get_profile_brief_for_user, create_profile_for_user
from app.crud.user import get_user_by_credentials, create_user
from app.depends import SessionDep, CurrentUserDep
from app.schemas.user import UserCreateSchema
from app.models import Token


router = APIRouter(prefix="/auth")


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    session: SessionDep, user_schema: Annotated[UserCreateSchema, Body(embed=True)]
) -> None:
    with session.cursor() as cursor:
        created_user_id = create_user(
            cursor,
            username=user_schema.username,
            email=user_schema.email,
            password=user_schema.password,
        )
        create_profile_for_user(cursor, created_user_id)

    session.commit()


@router.post("/token")
async def token(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    with session.cursor() as cursor:
        user = get_user_by_credentials(cursor, form_data.username, form_data.password)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="incorrect email or password",
        )
    token = create_access_token({"email": user.email})
    return Token(access_token=token, token_type="bearer")


@router.get("/me")
async def current_user(session: SessionDep, user: CurrentUserDep):
    with session.cursor() as cursor:
        return get_profile_brief_for_user(cursor, str(user.id))
