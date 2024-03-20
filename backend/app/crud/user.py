from typing import Optional
from app.core.security import hash_password
from app.models import User


__all__ = (
    "create_user_table",
    "create_user",
    "get_user_by_credentials",
    "get_user_by_email",
)


def create_user_table(cursor) -> None:
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS "User"(
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        );
    """
    )


def create_user(cursor, username: str, email: str, password: str) -> str:
    hashed_password = hash_password(password)

    cursor.execute(
        'INSERT INTO "User"(username, email, password_hash) VALUES (%s, %s, %s) RETURNING id',
        (username, email, hashed_password),
    )
    return cursor.fetchone()[0]


def get_user_by_credentials(cursor, email: str, password: str) -> Optional[User]:
    hashed_password = hash_password(password)

    cursor.execute(
        'SELECT id, username, email FROM "User" WHERE email = %s AND password_hash = %s',
        (email, hashed_password),
    )
    user_data = cursor.fetchone()

    if user_data:
        return User(
            id=user_data[0],
            username=user_data[1],
            email=user_data[2],
        )


def get_user_by_email(cursor, email: str) -> Optional[User]:
    cursor.execute('SELECT id, username, email FROM "User" WHERE email = %s', (email,))
    user_data = cursor.fetchone()
    if user_data:
        return User(id=user_data[0], username=user_data[1], email=user_data[2])
