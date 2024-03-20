import uuid
import enum
import pathlib
from typing import Any
from datetime import date
from pydantic import BaseModel


class Page(BaseModel):
    index: int
    next: str
    results: list[Any]


class Token(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    id: uuid.UUID
    username: str
    email: str


class UserInfo(User):
    elo: int


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
    white_win = "white_win"
    black_win = "black_win"
    draw = "draw"


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
    white_player: ProfileBrief
    black_player: ProfileBrief
    status: GameStatus
    register_date: date
    play_date: date
    time: int