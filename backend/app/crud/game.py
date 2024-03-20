import psycopg2
from typing import Optional
from datetime import datetime
from app.models import GameStatus, Game, GameInfo, ProfileBrief


__all__ = ("create_game_table", "create_game", "get_game_list")


def create_game_table(cursor) -> None:
    try:
        cursor.execute(
            "CREATE TYPE GAME_STATUS AS ENUM ('white_win', 'black_win', 'draw')"
        )
    except psycopg2.errors.DuplicateObject:
        cursor.connection.reset()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "Game"(
            id SERIAL PRIMARY KEY,
            approved BOOL DEFAULT FALSE,
            white_player uuid REFERENCES "User"(id) NOT NULL,
            black_player uuid REFERENCES "User"(id) NOT NULL,
            time INTEGER DEFAULT 0,
            status GAME_STATUS NOT NULL,
            register_date date NOT NULL DEFAULT CURRENT_DATE,
            play_date date NOT NULL
        )
    """
    )


def create_game(
    white_player: str,
    black_player: str,
    time: int,
    status: GameStatus,
    play_date: datetime,
) -> Optional[Game]:
    pass


def get_game_list(
    cursor, offset: int, limit: int, approved_only: bool = True
) -> list[GameInfo]:
    stmt = """
        SELECT
            game.id,
            game.approved,
            white_player_user.id,
            white_player_user.username,
            white_player_profile.image,
            white_player_profile.elo,
            black_player_user.id,
            black_player_user.username,
            black_player_profile.image,
            black_player_profile.elo,
            game.status,
            game.register_date,
            game.play_date,
            game.time
        FROM "Game" AS game
            LEFT JOIN "User" AS white_player_user ON game.white_player = white_player_user.id
                LEFT JOIN "Profile" as white_player_profile ON game.white_player = white_player_profile.user_id
            LEFT JOIN "User" AS black_player_user ON game.black_player = black_player_user.id
                LEFT JOIN "Profile" AS black_player_profile ON game.black_player = black_player_profile.user_id
    """
    if approved_only:
        stmt += "WHERE game.approved = true\n"
    stmt += "OFFSET %s LIMIT %s"

    cursor.execute(
        stmt,
        (offset, limit),
    )

    games = []
    for game_data in cursor.fetchall():
        games.append(
            GameInfo(
                id=game_data[0],
                approved=game_data[1],
                white_player=ProfileBrief(
                    id=game_data[2], username=game_data[3], image=game_data[4], elo=game_data[5]
                ),
                black_player=ProfileBrief(
                    id=game_data[6], username=game_data[7], image=game_data[8], elo=game_data[9]
                ),
                status=game_data[10],
                register_date=game_data[11],
                play_date=game_data[12],
                time=game_data[13],
            )
        )
    return games
