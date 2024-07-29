import uuid
from fastapi import APIRouter, HTTPException, status
from .. import models, db, deps


PAGING_MAX_PROFILE_GAMES = 5

router = APIRouter()


@router.get("/{user_id}")
async def get_user_profile(session: deps.SessionDep, user_id: uuid.UUID):
    with session.cursor() as cursor:
        user_profile = profile.get(cursor, str(user_id))

        if user_profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                details="could not find user with matching id",
            )

        games_status = game.user_stats(cursor, user_id=str(user_id))

    return {"profile": user_profile, "games_status": games_status}


@router.get("/{user_id}/games")
async def get_user_games(session: deps.SessionDep, user_id: uuid.UUID, page: int = 1):
    if page <= 0:
        page = 1

    where_filters = (db.GAME_TABLE.white_player == user_id) | (
        db.GAME_TABLE.black_player == user_id
    )

    with session.cursor() as cursor:
        return models.Page(
            index=page,
            results_per_page=PAGING_MAX_PROFILE_GAMES,
            count=1,
            results=db.get_games(
                cursor,
                where=where_filters,
                limit=PAGING_MAX_PROFILE_GAMES,
                offset=PAGING_MAX_PROFILE_GAMES * (page - 1),
            ),
        )
