from typing import Optional
from pypika import terms, Table, Column, Query
from pypika.dialects import PostgreSQLQuery as PostgresQuery
from app.core.security import hash_password
from app.models import User


__all__ = ("user",)


class _UserCRUD:
    T = Table("User")

    def create_table(self, cursor) -> None:
        cursor.execute(
            Query.create_table(self.T)
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

    def create(self, cursor, username: str, email: str, password: str) -> str:
        password_hash = hash_password(password)
        cursor.execute(
            PostgresQuery.into(self.T)
            .columns(self.T.username, self.T.email, self.T.password_hash)
            .insert(username, email, password_hash)
            .returning(self.T.id)
            .get_sql()
        )
        return cursor.fetchone()[0]

    def get(self, cursor, *, where=terms.EmptyCriterion()) -> Optional[User]:
        cursor.execute(
            Query.from_(self.T)
            .select(self.T.id, self.T.username, self.T.email)
            .where(where)
            .get_sql()
        )
        if data := cursor.fetchone():
            return User(id=data[0], username=data[1], email=data[2])


user = _UserCRUD()
