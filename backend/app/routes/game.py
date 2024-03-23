import asyncio
from fastapi import APIRouter
from app.models import Page
from app.schemas import CreateGameSchema
from app.crud.game import create_game, get_game_list
from app.depends import SessionDep


MAX_GAMES_PER_PAGE = 10


router = APIRouter(prefix="/games")


@router.get("/")
async def index(session: SessionDep, page: int = 0, approved_only: bool = True):
    """list chess games that are stored in the database"""
    with session.cursor() as cursor:
        games = get_game_list(
            cursor,
            offset=page * MAX_GAMES_PER_PAGE,
            limit=MAX_GAMES_PER_PAGE,
            approved_only=approved_only,
        )
    return Page(index=page, next="", results=games)


@router.post("/add")
async def add_game(session: SessionDep, game: CreateGameSchema):
    print(game)
    with session.cursor() as cursor:
        create_game(
            cursor, 
            white_player=str(game.white_player_id),
            black_player=str(game.black_player_id),
            time_control=game.time_control,
            status=game.results,
            play_date=game.play_date,
            approved=False
        )
    return 0
