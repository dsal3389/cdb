from datetime import date
from pypika import Table, Query, Column, terms, functions as fn

from .user import USER_TABLE
from .profile import PROFILE_TABLE
from .. import models

__all__ = ("GAME_TABLE", "create_game_table", "create_game", "count_games", "get_games")


GAME_TABLE = Table("Game")


def create_game_table(cursor) -> None:
    cursor.execute(
        """
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_type WHERE typname = 'game_status' AND typtype = 'e'
                ) THEN
                    CREATE TYPE game_status AS ENUM ('white_win', 'black_win', 'draw');
                END IF;
                IF NOT EXISTS (
                    SELECT 1 FROM pg_type WHERE typname = 'game_type' AND typtype = 'e'
                ) THEN
                    CREATE TYPE game_type AS ENUM ('BULLET', 'BLITZ', 'RAPID');
                END IF;
            END $$;
        """
    )

    cursor.execute(
        Query.create_table(GAME_TABLE)
        .if_not_exists()
        .columns(
            Column("id", "SERIAL"),
            Column("approved", "BOOL", default=False),
            Column("white_player", 'uuid REFERENCES "User"(id) NOT NULL'),
            Column("black_player", 'uuid REFERENCES "User"(id) NOT NULL'),
            Column("time_control", "TEXT", nullable=False),
            Column("register_date", "date NOT NULL DEFAULT CURRENT_DATE"),
            Column("play_date", "date", nullable=False),
            Column("status", "GAME_STATUS", nullable=False),
            Column("type", "GAME_TYPE", nullable=False),
        )
        .primary_key("id")
        .get_sql()
    )


def create_game(
    cursor,
    white_player_id: str,
    black_player_id: str,
    time_control: models.GameTimeControl,
    status: models.GameStatus,
    play_date: date,
    approved: bool,
) -> None:
    game_type = _identify_game_type(time_control)
    cursor.execute(
        Query.into(GAME_TABLE)
        .columns(
            GAME_TABLE.white_player,
            GAME_TABLE.black_player,
            GAME_TABLE.time_control,
            GAME_TABLE.play_date,
            GAME_TABLE.status,
            GAME_TABLE.type,
            GAME_TABLE.approved,
        )
        .insert(
            white_player_id,
            black_player_id,
            time_control,
            play_date,
            status,
            game_type,
            approved,
        )
        .get_sql()
    )


def count_games(cursor, *, where=terms.EmptyCriterion()) -> int:
    cursor.execute(
        Query.from_(GAME_TABLE).select(fn.Count(GAME_TABLE.id)).where(where).get_sql()
    )
    return cursor.fetchone()[0]


def get_games(
    cursor,
    *,
    where=terms.EmptyCriterion(),
    limit: int = 100,
    offset: int = 0,
) -> list[models.Game]:
    white_player_user_table = Table(USER_TABLE.get_table_name(), alias="white_player")
    white_player_profile_table = Table(
        PROFILE_TABLE.get_table_name(), alias="white_player_profile"
    )

    black_player_user_table = Table(USER_TABLE.get_table_name(), alias="black_player")
    black_player_profile_table = Table(
        PROFILE_TABLE.get_table_name(), alias="black_player_profile"
    )

    cursor.execute(
        Query.from_(GAME_TABLE)
        .left_join(white_player_user_table)
        .on(GAME_TABLE.white_player == white_player_user_table.id)
        .left_join(white_player_profile_table)
        .on(white_player_profile_table.user_id == white_player_user_table.id)
        .left_join(black_player_user_table)
        .on(GAME_TABLE.black_player == black_player_user_table.id)
        .left_join(black_player_profile_table)
        .on(black_player_profile_table.user_id == black_player_user_table.id)
        .select(
            GAME_TABLE.id,
            GAME_TABLE.approved,
            white_player_user_table.id,
            white_player_user_table.username,
            white_player_profile_table.image,
            white_player_profile_table.elo,
            black_player_user_table.id,
            black_player_user_table.username,
            black_player_profile_table.image,
            black_player_profile_table.elo,
            GAME_TABLE.status,
            GAME_TABLE.register_date,
            GAME_TABLE.play_date,
            GAME_TABLE.time_control,
            GAME_TABLE.type,
        )
        .where(where)
        .limit(limit)
        .offset(offset)
        .get_sql()
    )

    results = []
    for game_data in cursor.fetchall():
        results.append(
            models.Game(
                id=game_data[0],
                approved=game_data[1],
                white_player=models.ProfileBrief(
                    id=game_data[2],
                    username=game_data[3],
                    image=game_data[4],
                    elo=game_data[5],
                ),
                black_player=models.ProfileBrief(
                    id=game_data[6],
                    username=game_data[7],
                    image=game_data[8],
                    elo=game_data[9],
                ),
                status=game_data[10],
                register_date=game_data[11],
                play_date=game_data[12],
                time_control=game_data[13],
                type=game_data[14],
            )
        )
    return results
