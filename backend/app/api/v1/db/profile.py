import pathlib
from typing import Optional
from pypika import Table, Query, Column, functions as fn

from app.core import settings
from .user import USER_TABLE
from .. import models


__all__ = (
    "PROFILE_TABLE",
    "create_profile_table",
    "create_profile",
    "get_profile_by_user_id",
    "get_profile_brief_by_user_id",
    "lookup_profile_brief_by_username_str",
)


PROFILE_TABLE = Table("Profile")


def create_profile_table(cursor) -> None:
    cursor.execute(
        Query.create_table(PROFILE_TABLE)
        .if_not_exists()
        .columns(
            Column("id", "SERIAL PRIMARY KEY", nullable=False),
            Column("image", "TEXT", nullable=False),
            Column("elo", "INTEGER", default=settings.DEFAULT_ELO),
            Column(
                "user_id",
                'UUID NOT NULL UNIQUE REFERENCES "User"(id) ON DELETE CASCADE',
            ),
        )
        .get_sql()
    )


def create_profile(
    cursor,
    user_id: str,
    image: pathlib.Path | str = settings.DEFAULT_IMAGE_PATH,
    elo: int = settings.DEFAULT_ELO,
) -> None:
    image_path = image

    if isinstance(image_path, pathlib.Path):
        image_path = image_path.as_posix()

    cursor.execute(
        Query.into(PROFILE_TABLE)
        .columns(PROFILE_TABLE.elo, PROFILE_TABLE.image, PROFILE_TABLE.user_id)
        .insert(elo, image_path, user_id)
        .get_sql()
    )


def get_profile_by_user_id(cursor, user_id: str) -> Optional[models.Profile]:
    cursor.execute(
        Query.from_(PROFILE_TABLE)
        .join(USER_TABLE)
        .on(PROFILE_TABLE.user_id == USER_TABLE.id)
        .select(USER_TABLE.id, USER_TABLE.username, USER_TABLE.image, USER_TABLE.elo)
        .where(PROFILE_TABLE.user_id == user_id)
        .get_sql()
    )
    if profile_data := cursor.fetchone():
        return models.Profile(
            id=profile_data[0],
            username=profile_data[1],
            image=profile_data[2],
            elo=profile_data[3],
        )


def get_profile_brief_by_user_id(cursor, user_id: str) -> Optional[models.ProfileBrief]:
    cursor.execute(
        Query.from_(PROFILE_TABLE)
        .join(USER_TABLE)
        .on(PROFILE_TABLE.user_id == USER_TABLE.id)
        .select(
            USER_TABLE.id, USER_TABLE.username, PROFILE_TABLE.image, PROFILE_TABLE.elo
        )
        .where(PROFILE_TABLE.user_id == user_id)
        .get_sql()
    )
    if profile_data := cursor.fetchone():
        return models.ProfileBrief(
            id=profile_data[0],
            username=profile_data[1],
            image=profile_data[2],
            elo=profile_data[3],
        )


def lookup_profile_brief_by_username_str(
    cursor, s: str, limit: int
) -> list[models.ProfileBrief]:
    cursor.execute(
        Query.from_(PROFILE_TABLE)
        .join(USER_TABLE)
        .on(PROFILE_TABLE.user_id == USER_TABLE.id)
        .select(
            USER_TABLE.id, USER_TABLE.username, PROFILE_TABLE.image, PROFILE_TABLE.elo
        )
        .where(USER_TABLE.username.like(f"%{s}%"))
        .limit(limit)
        .get_sql()
    )

    results = []
    for result in cursor.fetchall():
        results.append(
            models.ProfileBrief(
                id=result[0], username=result[1], image=result[2], elo=result[3]
            )
        )
    return results
