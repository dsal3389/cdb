import uuid
from fastapi import APIRouter, HTTPException, status
from app.crud.profile import get_profile_for_user
from app.crud.game import get_game_list
from app.depends import SessionDep


router = APIRouter(prefix="/profile")


@router.get("/{user_id}")
async def get_user_profile(session: SessionDep, user_id: uuid.UUID):
    """returns the user profile data"""
    with session.cursor() as cursor:
        profile = get_profile_for_user(cursor, str(user_id))

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            details="could not find user with matching id",
        )
    return profile


@router.get("/{user_id}/games")
async def get_user_profile(session: SessionDep, user_id: uuid.UUID):
    with session.cursor() as cursor:
        profile = get_profile_for_user(cursor, str(user_id))

    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            details="could not find user with matching id",
        )
    return profile
