import uuid
from pydantic import PositiveInt
from fastapi import APIRouter, HTTPException, status
from .. import models, db, deps


PAGING_MAX_PROFILE_GAMES = 5

router = APIRouter()


@router.get("/lookup", response_model=models.Results[models.ProfileBrief])
async def lookup_profile_briefs(session: deps.SessionDep, username: str):
    """lookup for user profiles based on the username"""
    with session.cursor() as cursor:
        results = db.lookup_profile_brief_by_username_str(cursor, username, limit=7)
        return models.Results(count=len(results), results_per_page=7, results=results)


@router.get("/{user_id}", response_model=models.Profile)
async def get_user_profile(session: deps.SessionDep, user_id: uuid.UUID):
    with session.cursor() as cursor:
        user_profile = profile.get(cursor, str(user_id))

        if user_profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="could not find user with matching id",
            )

        games_status = game.user_stats(cursor, user_id=str(user_id))

    return {"profile": user_profile, "games_status": games_status}


@router.get("/{user_id}/games")
async def get_user_games(
    session: deps.SessionDep, user_id: uuid.UUID, page: PositiveInt = 1
):
    where_filters = (db.GAME_TABLE.white_player == user_id) | (
        db.GAME_TABLE.black_player == user_id
    )

    with session.cursor() as cursor:
        return models.Results(
            count=1,
            results_per_page=PAGING_MAX_PROFILE_GAMES,
            results=db.get_games(
                cursor,
                where=where_filters,
                limit=PAGING_MAX_PROFILE_GAMES,
                offset=PAGING_MAX_PROFILE_GAMES * (page - 1),
            ),
        )
