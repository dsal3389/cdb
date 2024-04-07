import pathlib
from typing import Optional
from pypika import Table, Column, Query
from app.core.settings import settings
from app.models import ProfileBrief, Profile
from .user_ import user


__all__ = ("profile",)


class _ProfileCRUD:
    T = Table("Profile")

    def create_table(self, cursor) -> None:
        cursor.execute(
            Query.create_table(self.T)
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

    def create(
        self,
        cursor,
        user_id: str,
        image: pathlib.Path | str = settings.DEFAULT_IMAGE_PATH,
        elo: int = settings.DEFAULT_ELO,
    ) -> None:
        image_path = image

        if isinstance(image_path, pathlib.Path):
            image_path = image_path.as_posix()

        cursor.execute(
            Query.into(self.T)
            .columns(self.T.elo, self.T.image, self.T.user_id)
            .insert(elo, image_path, user_id)
            .get_sql()
        )

    def get(self, cursor, user_id: str) -> Optional[Profile]:
        cursor.execute(
            Query.from_(self.T)
            .join(user.T)
            .on(self.T.user_id == user.T.id)
            .select(user.T.id, user.T.username, self.T.image, self.T.elo)
            .where(self.T.user_id == user_id)
            .get_sql()
        )
        if profile_data := cursor.fetchone():
            return Profile(
                id=profile_data[0],
                username=profile_data[1],
                image=profile_data[2],
                elo=profile_data[3],
            )

    def get_brief(self, cursor, user_id: str) -> Optional[ProfileBrief]:
        cursor.execute(
            Query.from_(self.T)
            .join(user.T)
            .on(self.T.user_id == user.T.id)
            .select(user.T.id, user.T.username, self.T.image, self.T.elo)
            .where(self.T.user_id == user_id)
            .get_sql()
        )
        if profile_data := cursor.fetchone():
            return ProfileBrief(
                id=profile_data[0],
                username=profile_data[1],
                image=profile_data[2],
                elo=profile_data[3],
            )


profile = _ProfileCRUD()
