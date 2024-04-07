import psycopg2
from datetime import date
from typing import Optional
from pypika import Table, Query, Column, terms, functions as fn
from app.models import (
    Game,
    GameType,
    GameStatus,
    GameTimeControl,
    GameUserStats,
    GameInfo,
    ProfileBrief,
)


__all__ = ("game",)


def _identify_game_type(time_control: GameTimeControl) -> GameType:
    if time_control in (
        GameTimeControl.BLITZ_1,
        GameTimeControl.BLITZ_2,
        GameTimeControl.BLITZ_3,
        GameTimeControl.BLITZ_4,
    ):
        return GameType.BLITZ
    if time_control in (
        GameTimeControl.BULLET_1,
        GameTimeControl.BULLET_2,
        GameTimeControl.BULLET_3,
    ):
        return GameType.BULLET
    else:
        return GameType.RAPID


class _GameCRUD:
    T = Table("Game")

    def create_table(self, cursor) -> None:
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
            Query.create_table(self.T)
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

    def create(
        self,
        cursor,
        white_player: str,
        black_player: str,
        time_control: GameTimeControl,
        status: GameStatus,
        play_date: date,
        approved: bool,
    ) -> None:
        game_type = _identify_game_type(time_control)
        cursor.execute(
            Query.into(self.T)
            .columns(
                self.T.white_player,
                self.T.black_player,
                self.T.time_control,
                self.T.play_date,
                self.T.status,
                self.T.type,
                self.T.approved,
            )
            .insert(
                white_player,
                black_player,
                time_control,
                play_date,
                status,
                game_type,
                approved,
            )
            .get_sql()
        )

    def list_games_info(
        self,
        cursor,
        *,
        where=terms.EmptyCriterion(),
        limit: int = 100,
        offset: int = 0,
    ) -> list[GameInfo]:
        white_player_user = Table("User", alias="white_player")
        white_player_profile = Table("Profile", alias="white_player_profile")
        black_player_user = Table("User", alias="black_player")
        black_player_profile = Table("Profile", alias="black_player_profile")

        cursor.execute(
            Query.from_(self.T)
            .left_join(white_player_user)
            .on(self.T.white_player == white_player_user.id)
            .left_join(white_player_profile)
            .on(white_player_profile.user_id == white_player_user.id)
            .left_join(black_player_user)
            .on(self.T.black_player == black_player_user.id)
            .left_join(black_player_profile)
            .on(black_player_profile.user_id == black_player_user.id)
            .select(
                self.T.id,
                self.T.approved,
                white_player_user.id,
                white_player_user.username,
                white_player_profile.image,
                white_player_profile.elo,
                black_player_user.id,
                black_player_user.username,
                black_player_profile.image,
                black_player_profile.elo,
                self.T.status,
                self.T.register_date,
                self.T.play_date,
                self.T.time_control,
                self.T.type,
            )
            .where(where)
            .limit(limit)
            .offset(offset)
            .get_sql()
        )

        results = []
        for game_data in cursor.fetchall():
            results.append(
                GameInfo(
                    id=game_data[0],
                    approved=game_data[1],
                    white_player=ProfileBrief(
                        id=game_data[2],
                        username=game_data[3],
                        image=game_data[4],
                        elo=game_data[5],
                    ),
                    black_player=ProfileBrief(
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

    def count(self, cursor, where=terms.EmptyCriterion()) -> int:
        cursor.execute(
            Query.from_(self.T).select(fn.Count(self.T.id)).where(where).get_sql()
        )
        return cursor.fetchone()[0]

    def user_stats(
        self, cursor, *, user_id
    ) -> GameUserStats:
        cursor.execute(
            Query.from_(self.T)
            .select(self.T.status, fn.Count(self.T.id))
            .where(
                (self.T.white_player == user_id) & (self.T.status == GameStatus.WHITE_WIN) |
                (self.T.black_player == user_id) & (self.T.status == GameStatus.BLACK_WIN) |
                ((self.T.white_player == user_id) | (self.T.black_player == user_id)) & (self.T.status == GameStatus.DRAW)
            )
            .groupby(self.T.status)
            .get_sql()
        )
        print(cursor.fetchall())
        return GameUserStats(
            draws=0,
            wins_as_white=0,
            wins_as_black=0,
            loses_as_white=0,
            loses_as_black=0
        )


game = _GameCRUD()
