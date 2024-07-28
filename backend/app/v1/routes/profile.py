import uuid
import asyncio
from fastapi import APIRouter, HTTPException, status
from app.crud import profile, game
from app.depends import SessionDep
from app.models import Page


PAGING_MAX_PROFILE_GAMES = 5

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/{user_id}")
async def get_user_profile(session: SessionDep, user_id: uuid.UUID):
    with session.cursor() as cursor:
        user_profile = profile.get(cursor, str(user_id))

        if user_profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                details="could not find user with matching id",
            )
            
        games_status = game.user_stats(cursor, user_id=str(user_id))

    return {
        "profile": user_profile,
        "games_status": games_status
    }


@router.get("/{user_id}/games")
async def get_user_games(session: SessionDep, user_id: uuid.UUID, page: int = 1):
    if page <= 0:
        page = 1

    where_filters = (game.T.white_player == user_id) | (game.T.black_player == user_id)

    with session.cursor() as cursor:
        return Page(
            index=page,
            results_per_page=PAGING_MAX_PROFILE_GAMES,
            count=game.count(cursor, where=where_filters),
            results=game.list_games_info(
                cursor,
                where=where_filters,
                limit=PAGING_MAX_PROFILE_GAMES,
                offset=PAGING_MAX_PROFILE_GAMES * (page - 1),
            ),
        )
