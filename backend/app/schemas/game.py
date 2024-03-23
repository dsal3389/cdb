import uuid
from datetime import date
from pydantic import BaseModel
from app.models import GameStatus, GameTimeControl


__all__ = ("CreateGameSchema",)


class CreateGameSchema(BaseModel):
    white_player_id: uuid.UUID
    black_player_id: uuid.UUID
    time_control: GameTimeControl
    results: GameStatus
    play_date: date

