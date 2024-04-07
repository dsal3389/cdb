import uuid
import enum
import pathlib
from typing import Any
from datetime import date
from pydantic import BaseModel, computed_field, Field


class Page(BaseModel):
    index: int
    count: int
    results_per_page: int = Field(exclude=True)
    results: list[Any]

    @computed_field
    def prev(self) -> bool:
        return self.index > 1

    @computed_field
    def next(self) -> bool:
        return self.index * self.results_per_page < self.count


class Token(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    id: uuid.UUID
    username: str
    email: str


class UserInfo(User):
    elo: int


class CreateUser(BaseModel):
    username: str
    email: str
    password: str


class Profile(BaseModel):
    id: uuid.UUID
    username: str
    image: str
    elo: int


class ProfileBrief(BaseModel):
    id: uuid.UUID
    username: str
    image: pathlib.Path
    elo: int


class GameStatus(str, enum.Enum):
    WHITE_WIN = "white_win"
    BLACK_WIN = "black_win"
    DRAW = "draw"


class GameType(str, enum.Enum):
    BULLET = "BULLET"
    BLITZ = "BLITZ"
    RAPID = "RAPID"


class GameTimeControl(str, enum.Enum):
    BULLET_1 = "1 min"
    BULLET_2 = "1 min | 1 sec"
    BULLET_3 = "2 min | 1 sec"
    BLITZ_1 = "3 min"
    BLITZ_2 = "3 min | 2 sec"
    BLITZ_3 = "5 min"
    BLITZ_4 = "5 min | 5 sec"
    RAPID_1 = "10 min"
    RAPID_2 = "15 min | 10 sec"
    RAPID_3 = "20 min"
    RAPID_4 = "30 min"


class Game(BaseModel):
    id: int
    approved: bool
    white_player: ProfileBrief
    black_player: ProfileBrief
    time: int
    register_date: date
    play_date: date


class GameInfo(BaseModel):
    id: int
    approved: bool
    time_control: GameTimeControl
    white_player: ProfileBrief
    black_player: ProfileBrief
    status: GameStatus
    register_date: date
    play_date: date
    type: GameType


class GameUserStats(BaseModel):
    draws: int
    wins_as_white: int
    wins_as_black: int
    loses_as_white: int
    loses_as_black: int

    @computed_field
    def overall_wins(self) -> int:
        return self.wins_as_white + self.wins_as_black

    @computed_field
    def overall_loses(self) -> int:
        return self.loses_as_white + self.loses_as_black


class CreateGame(BaseModel):
    white_player_id: uuid.UUID
    black_player_id: uuid.UUID
    time_control: GameTimeControl
    results: GameStatus
    play_date: date
