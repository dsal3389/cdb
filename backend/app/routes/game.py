from fastapi import APIRouter
from app.models import Page
from app.crud.game import get_game_list
from app.depends import SessionDep


MAX_GAMES_PER_PAGE = 10


router = APIRouter(prefix="/games")


@router.get("/")
async def index(session: SessionDep, page: int = 0, approved_only: bool = True):
    with session.cursor() as cursor:
        games = get_game_list(
            cursor,
            offset=page * MAX_GAMES_PER_PAGE,
            limit=MAX_GAMES_PER_PAGE,
            approved_only=approved_only,
        )
    return Page(index=page, next="", results=games)
