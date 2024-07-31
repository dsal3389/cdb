from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Body, status
from fastapi.security import OAuth2PasswordRequestForm

from app.core.security import create_access_token, hash_password
from .. import models, db, deps


router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    session: deps.SessionDep,
    user_schema: Annotated[models.CreateUser, Body(embed=False)],
) -> None:
    """register new username to the database and creates for him a profile"""
    with session.cursor() as cursor:
        created_user_id = db.create_user(
            cursor,
            username=user_schema.username,
            email=user_schema.email,
            password=user_schema.password,
        )
        db.create_profile(cursor, created_user_id)

    session.commit()


@router.post("/token", response_model=models.Token)
async def token(
    session: deps.SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    """return bearer token for registered user"""
    hashed_password = hash_password(form_data.password)

    with session.cursor() as cursor:
        user_ = db.find_user(
            cursor,
            where=(db.USER_TABLE.email == form_data.username)
            & (db.USER_TABLE.password_hash == hashed_password),
        )

    if user_ is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="incorrect email or password",
        )
    token = create_access_token({"email": user_.email})
    return models.Token(access_token=token, token_type="bearer")


@router.get("/me", response_model=models.ProfileBrief)
async def current_user(session: deps.SessionDep, user: deps.CurrentUserDep):
    """returns the current authenticated user based on given bearer token"""
    with session.cursor() as cursor:
        return db.get_profile_brief_by_user_id(cursor, str(user.id))
