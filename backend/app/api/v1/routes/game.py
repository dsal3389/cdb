from pydantic import PositiveInt
from fastapi import APIRouter

from .. import models, db, deps


MAX_GAMES_PER_PAGE = 10


router = APIRouter()


@router.get("/", response_model=models.Results[models.Game])
async def index(session: deps.SessionDep, page: PositiveInt = 1):
    with session.cursor() as cursor:
        return models.Results(
            count=db.count_games(cursor),
            results_per_page=MAX_GAMES_PER_PAGE,
            results=db.get_games(
                cursor, offset=(page - 1) * MAX_GAMES_PER_PAGE, limit=MAX_GAMES_PER_PAGE
            ),
        )


@router.post("/add")
async def add_game(session: deps.SessionDep, create_game: models.CreateGame):
    with session.cursor() as cursor:
        db.create_game(
            cursor,
            white_player_id=str(create_game.white_player_id),
            black_player_id=str(create_game.black_player_id),
            time_control=create_game.time_control,
            status=create_game.results,
            play_date=create_game.play_date,
            approved=False,
        )
