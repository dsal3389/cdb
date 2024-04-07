import asyncio
from fastapi import APIRouter
from app.models import Page, CreateGame
from app.depends import SessionDep
from app.crud import game


MAX_GAMES_PER_PAGE = 10


router = APIRouter(prefix="/games")


@router.get("/")
async def index(session: SessionDep, page: int = 1):
    if page <= 0:
        page = 1

    with session.cursor() as cursor:
        return Page(
            index=page,
            results_per_page=MAX_GAMES_PER_PAGE,
            count=game.count(cursor),
            results=game.list_games_info(
                cursor, offset=(page - 1) * MAX_GAMES_PER_PAGE, limit=MAX_GAMES_PER_PAGE
            ),
        )


@router.post("/add")
async def add_game(session: SessionDep, create_game: CreateGame):
    with session.cursor() as cursor:
        game.create(
            cursor,
            white_player=str(create_game.white_player_id),
            black_player=str(create_game.black_player_id),
            time_control=create_game.time_control,
            status=create_game.results,
            play_date=create_game.play_date,
            approved=False,
        )
    return 0
