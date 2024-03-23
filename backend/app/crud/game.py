import psycopg2
from typing import Optional
from datetime import date
from app.models import (
    Game,
    GameType,
    GameStatus,
    GameTimeControl,
    GameInfo,
    ProfileBrief
)


__all__ = ("create_game_table", "create_game", "get_game_list")


def _identify_game_type(time_control: GameTimeControl) -> GameType:
    if time_control in (
        GameTimeControl.BLITZ_1, 
        GameTimeControl.BLITZ_2, 
        GameTimeControl.BLITZ_3, 
        GameTimeControl.BLITZ_4
    ):
        return GameType.BLITZ
    if time_control in (
        GameTimeControl.BULLET_1,
        GameTimeControl.BULLET_2,
        GameTimeControl.BULLET_3
    ):
        return GameType.BULLET
    else:
        return GameType.RAPID


def create_game_table(cursor) -> None:
    cursor.execute("""
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
        
        CREATE TABLE IF NOT EXISTS "Game"(
            id SERIAL PRIMARY KEY,
            approved BOOL DEFAULT FALSE,
            white_player uuid REFERENCES "User"(id) NOT NULL,
            black_player uuid REFERENCES "User"(id) NOT NULL,
            time_control TEXT NOT NULL,
            register_date date NOT NULL DEFAULT CURRENT_DATE,
            play_date date NOT NULL,
            status GAME_STATUS NOT NULL,
            type GAME_TYPE NOT NULL
        );
    """
    )


def create_game(
    cursor,
    white_player: str,
    black_player: str,
    time_control: GameTimeControl,
    status: GameStatus,
    play_date: date,
    approved: bool
) -> Optional[Game]:
    game_type = _identify_game_type(time_control)
    cursor.execute("""
        INSERT INTO "Game"(white_player, black_player, time_control, play_date, status, type, approved) VALUES (
            %s, %s, %s, %s, %s, %s, %s
        )
    """, (white_player, black_player, time_control, play_date, status, game_type, approved))


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
            game.time_control,
            game.type
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
                time_control=game_data[13],
                type=game_data[14]
            )
        )
    return games
