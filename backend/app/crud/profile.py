import pathlib
from typing import Optional
from app.core.settings import settings
from app.models import ProfileBrief, Profile


__all__ = ("create_profile_table", "create_profile_for_user", "get_profile_for_user")


def create_profile_table(cursor) -> None:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "Profile"(
            id SERIAL PRIMARY KEY,
            image TEXT NOT NULL,
            elo INTEGER,
            user_id UUID NOT NULL UNIQUE REFERENCES "User"(id) ON DELETE CASCADE
        )
    """
    )


def create_profile_for_user(
    cursor,
    user_id: str,
    image: pathlib.Path | str = settings.DEFAULT_IMAGE_PATH,
    elo: int = settings.DEFAULT_ELO,
) -> None:
    """create new profile for the given user, usually called after a new user created"""
    image_path = image
    if isinstance(image_path, pathlib.Path):
        image_path = image_path.as_posix()
    cursor.execute(
        'INSERT INTO "Profile"(elo, image, user_id) VALUES (%s, %s, %s)',
        (elo, image_path, user_id),
    )


def get_profile_brief_for_user(cursor, user_id: str) -> Optional[ProfileBrief]:
    """returns the given users id profile"""
    cursor.execute(
        """
        SELECT u.id, u.username, p.image, p.elo FROM "User" u
            JOIN "Profile" p ON p.user_id = u.id WHERE u.id = %s
    """,
        (user_id,),
    )
    profile_data = cursor.fetchone()

    if profile_data:
        return Profile(
            id=profile_data[0],
            username=profile_data[1],
            image=profile_data[2],
            elo=profile_data[3],
        )


def get_profile_for_user(cursor, user_id: str) -> Optional[Profile]:
    """returns the given users id profile"""
    cursor.execute(
        """
        SELECT u.id, u.username, p.image, p.elo FROM "User" u
            JOIN "Profile" p ON p.user_id = u.id WHERE u.id = %s
    """,
        (user_id,),
    )
    profile_data = cursor.fetchone()

    if profile_data:
        return Profile(
            id=profile_data[0],
            username=profile_data[1],
            image=profile_data[2],
            elo=profile_data[3],
        )
