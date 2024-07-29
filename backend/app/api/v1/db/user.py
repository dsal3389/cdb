from typing import Optional
from pypika import Table, Query, Column, terms
from pypika.dialects import PostgreSQLQuery

from app.core import security
from .. import models

__all__ = ("USER_TABLE", "create_user_table", "create_user", "find_user")


USER_TABLE = Table("User")


def create_user_table(cursor) -> None:
    cursor.execute(
        Query.create_table(USER_TABLE)
        .if_not_exists()
        .columns(
            Column("id", "UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY"),
            Column("username", "TEXT", nullable=False),
            Column("email", "TEXT", nullable=False),
            Column("password_hash", "TEXT", nullable=False),
        )
        .unique("email")
        .get_sql()
    )


def create_user(cursor, username: str, email: str, password: str) -> str:
    password_hash = security.hash_password(password)
    cursor.execute(
        PostgreSQLQuery.into(USER_TABLE)
        .columns(USER_TABLE.username, USER_TABLE.email, USER_TABLE.password_hash)
        .insert(username, email, password_hash)
        .returning(USER_TABLE.id)
        .get_sql()
    )
    return cursor.fetchone()[0]


def find_user(cursor, *, where=terms.EmptyCriterion()) -> Optional[models.User]:
    cursor.execute(
        Query.from_(USER_TABLE)
        .select(USER_TABLE.id, USER_TABLE.username, USER_TABLE.email)
        .where(where)
        .get_sql()
    )
    if data := cursor.fetchone():
        return models.User(id=data[0], username=data[1], email=data[2])
